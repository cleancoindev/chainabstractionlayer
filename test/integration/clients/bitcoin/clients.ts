import * as BTC from '@liquality/bitcoin';
import { Client } from '@liquality/client';
import { Network } from '@liquality/types';

// import { EVMConfig } from './config';

function getBtcClient(_network: Network) {
    // const config = EVMConfig(network);
    const chainProvider = new BTC.BitcoinNodeChainProvider({
        url: 'http://localhost:18443/',
        username: 'bitcoin',
        password: 'local321',
    });
    // const walletProvider = new EVM.EvmWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    // const swapProvider = new EVM.EvmSwapProvider(config.swapOptions, walletProvider);
    return new Client(chainProvider);
}

export const BitcoinClient = getBtcClient(null);
