import * as Terra from '@liquality/terra';
import { Client } from '@liquality/client';
// import { WalletOptions } from '@liquality/types';

import { NearConfig } from './config';

function getTerraClient(network: Terra.TerraTypes.TerraNetwork) {
    const config = NearConfig(network);
    const chainProvider = new Terra.TerraChainProvider(network);
    // const walletProvider = new Near.NearWalletProvider(config.walletOptions as WalletOptions, chainProvider);
    // const swapProvider = new Near.NearSwapProvider({ baseURL: network.helperUrl }, walletProvider);
    return new Client(chainProvider, walletProvider, swapProvider);
}

export const NearClient = getTerraClient(Terra.TerraNetworks.terra_testnet);
