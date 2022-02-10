import { Chain, JsonRpcProvider } from '@liquality/client';
import { Block, BigNumberish, Transaction, AddressType, Asset, FeeData } from '@liquality/types';

interface ProviderOptions {
    // RPC URI
    url: string;
    // Authentication username
    username?: string;
    // Authentication password
    password?: string;
    // Bitcoin network
    // network: BitcoinNetwork;
    // Number of block confirmations to target for fee. Defaul: 1
    // feeBlockConfirmations?: number;
    // Default fee per byte for transactions. Default: 3
    // defaultFeePerByte?: number;
}

export class BitcoinNodeChainProvider extends Chain<any> {
    private _jsonRpc: JsonRpcProvider;

    constructor(url?: ProviderOptions) {
        super(null);
        this._jsonRpc = new JsonRpcProvider(url.url, url.username, url.password);
    }

    async getBlockByHash(blockHash: string, _includeTx?: boolean): Promise<Block<any, any>> {
        return await this._jsonRpc.send('getblock', [blockHash]);
    }

    getBlockByNumber(_blockNumber?: BigNumberish, _includeTx?: boolean): Promise<Block<any, any>> {
        throw new Error('Method not implemented.');
    }

    getBlockHeight(): Promise<BigNumberish> {
        return this._jsonRpc.send('getblockcount', []);
    }

    getTransactionByHash(_txHash: string): Promise<Transaction<any>> {
        throw new Error('Method not implemented.');
    }

    getBalance(_addresses: AddressType[], _assets: Asset[]): Promise<BigNumberish[]> {
        throw new Error('Method not implemented.');
    }

    getFees(): Promise<FeeData> {
        throw new Error('Method not implemented.');
    }

    sendRawTransaction(rawTransaction: string): Promise<string> {
        return this._jsonRpc.send('sendrawtransaction', [rawTransaction]);
    }

    sendRpcRequest(method: string, params: any[]): Promise<any> {
        return this._jsonRpc.send(method, params);
    }
}
