import { LCDClient } from '@terra-money/terra.js';

import { Chain, HttpClient } from '@liquality/client';
import { Block, Transaction, AddressType, Asset, BigNumberish, FeeData, BigNumber } from '@liquality/types';

import { InputTransaction, TerraNetwork, SupportedAssets } from '../types';
import { normalizeBlock, normalizeTransaction } from '../utils';

export class TerraChainProvider extends Chain<LCDClient> {
    private _httpClient: HttpClient;
    private _supporetedAssets: SupportedAssets;

    constructor(network: TerraNetwork, provider?: any) {
        super(network, provider);

        if (!provider && this.network.rpcUrl) {
            this.provider = new LCDClient({
                URL: this.network.rpcUrl,
                chainID: this.network.chainId as string,
            });
        }

        this._httpClient = new HttpClient({ url: (this.network as TerraNetwork).gasPricesUrl });
        this._supporetedAssets = (this.network as TerraNetwork).supportedAssets;
    }

    async getBlockByHash(): Promise<Block<any, InputTransaction>> {
        throw new Error('Method not implemented.');
    }

    async getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block<any, InputTransaction>> {
        console.log(includeTx);

        const block = await this.provider.tendermint.blockInfo(blockNumber);

        const parsedBlock = normalizeBlock(block);

        if (!includeTx) {
            return parsedBlock;
        }

        const txs = await this.provider.tx.txInfosByHeight(Number(block.block.header.height));

        const transactions = txs.map((tx) => normalizeTransaction(tx, this._supporetedAssets));

        return {
            ...parsedBlock,
            transactions,
        };
    }

    async getBlockHeight(): Promise<number> {
        const {
            block: {
                header: { height },
            },
        } = await this.provider.tendermint.blockInfo();

        return Number(height);
    }

    async getTransactionByHash(txHash: string): Promise<Transaction> {
        const transaction = await this.provider.tx.txInfo(txHash);

        if (!transaction) {
            throw new Error(`Transaction not found: ${txHash}`);
        }

        const currentBlock = await this.getBlockHeight();

        return normalizeTransaction(transaction, this._supporetedAssets, currentBlock);
    }

    async getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumberish[]> {
        const promiseBalances = await Promise.all(
            addresses.map(async (address) => {
                return await Promise.all(
                    assets.map(async (asset) => {
                        try {
                            let balance = 0;
                            if (asset.contractAddress) {
                                const token = await this.provider.wasm.contractQuery<{ balance: string }>(asset.contractAddress, {
                                    balance: { address },
                                });
                                balance = Number(token.balance);
                            } else {
                                const coins = await this.provider.bank.balance(address.toString());
                                balance = Number(coins[0].get(asset.name)?.amount) || 0;
                            }
                            return new BigNumber(balance);
                        } catch (err) {
                            if (err.message && err.message.includes('does not exist while viewing')) {
                                return new BigNumber(0);
                            }
                            throw err;
                        }
                    })
                );
            })
        );

        return promiseBalances.map((addressBalance: BigNumber[]) =>
            addressBalance.reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
        );
    }

    async getFees(asset: Asset): Promise<FeeData> {
        const feeAsset = this._supporetedAssets[asset.name]?.feeAsset;

        const prices = await this._httpClient.nodeGet('');
        return {
            fee: Number(prices[feeAsset]),
        };
    }

    async sendRawTransaction(): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async sendRpcRequest(): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
