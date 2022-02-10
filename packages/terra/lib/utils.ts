import { Block, Transaction, TxStatus } from '@liquality/types';

import { InputTransaction, SupportedAsset, SupportedAssets } from './types';

// import { validateExpiration, validateSecretHash, validateValue } from '@liquality/utils';
// import { InvalidAddressError } from '@liquality/errors';

import { DateTime } from 'luxon';

export const normalizeBlock = (data: any): Block<any, InputTransaction> => ({
    number: Number(data.block.header.height),
    hash: data.block_id.hash,
    parentHash: data.block.last_commit.block_id.hash,
    timestamp: convertDateToTimestamp(data.block.header.time),
    size: Number(data.block.header.height),
    _raw: data,
});

export const normalizeTransaction = (data: any, assets: SupportedAssets, currentBlock?: number): Transaction<InputTransaction> => {
    const _assets = Object.values(assets).map((a: SupportedAsset) => a.asset);
    const denom = Object.keys(data.tx.fee?.amount?._coins || {})?.[0];
    const fee = data.tx.fee?.amount?._coins?.[denom]?.amount?.toNumber();
    const msg = data.tx.body?.messages?.[0] || data.tx.value?.msg?.[0]?.value;

    let value = 0;

    if (Array.isArray(msg?.init_coins)) {
        value = msg.init_coins.find((e: any) => _assets.includes(e.denom))?.amount;
    } else if (typeof msg?.init_coins === 'object') {
        if (_assets.includes(msg.init_coins.denom)) {
            value = msg.init_coins.amount;
        }
    }

    const codeId = msg.code_id;
    let txParams = msg?.init_msg || msg?.execute_msg || {};

    if (Object.keys(txParams).length) {
        const initMsg = msg?.init_msg;
        const executeMsg = msg?.execute_msg;

        if (initMsg) {
            txParams = initMsg;
        }

        if (executeMsg && typeof txParams !== 'string') {
            txParams.method = executeMsg;

            if (txParams.method.claim) {
                txParams.secret = txParams.method.claim.secret;
            }
        }
    }

    const logs = data.logs?.[0];

    const contractAddress =
        logs?.eventsByType?.execute_contract?.contract_address[0] ||
        logs?.events?.find((e: any) => e.type === 'wasm')?.attributes.find((e: any) => e.key === 'contract_address').value ||
        '';

    const status = data.raw_log?.includes('failed to execute message') ? TxStatus.Failed : TxStatus.Success;

    return {
        value: Number(value),
        hash: data.txhash,
        confirmations: Math.min(currentBlock - data.height, 10),
        ...(txParams?.secret && { secret: txParams.secret }),
        fee,
        status,
        _raw: {
            ...txParams,
            contractAddress,
            codeId,
        },
    };
};

// export const doesTransactionMatchInitiation = (swapParams: SwapParams, transactionParams: any): boolean => {
//     return (
//         swapParams.recipientAddress === transactionParams.buyer &&
//         swapParams.refundAddress === transactionParams.seller &&
//         swapParams.secretHash === transactionParams.secret_hash &&
//         swapParams.expiration === transactionParams.expiration &&
//         swapParams.value.eq(transactionParams.value)
//     );
// };

// export const validateSwapParams = (swapParams: SwapParams) => {
//     validateValue(swapParams.value);
//     validateSecretHash(swapParams.secretHash);
//     validateExpiration(swapParams.expiration);
//     validateAddress(addressToString(swapParams.recipientAddress));
//     validateAddress(addressToString(swapParams.refundAddress));
// };

const convertDateToTimestamp = (fullDate: string): number => {
    return DateTime.fromISO(fullDate).toSeconds();
};

// const validateAddress = (address: string): void => {
//     if (typeof address !== 'string' || address.length !== 44) {
//         throw new InvalidAddressError(`Invalid address: ${address}`);
//     }
// };
