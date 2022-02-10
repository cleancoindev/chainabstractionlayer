import { SupportedAssets, TerraNetwork } from './types';

const supportedAssets: SupportedAssets = {
    LUNA: {
        asset: 'uluna',
        feeAsset: 'uluna',
    },
    UST: {
        asset: 'uusd',
        feeAsset: 'uusd',
        stableFee: true,
    },
    // '': {
    //     asset: 'asset',
    //     feeAsset: 'uluna',
    //     tokenAddress: '',
    // },
};

const terra_mainnet: TerraNetwork = {
    name: 'mainnet',
    networkId: 'mainnet',
    rpcUrl: 'https://lcd.terra.dev',
    helperUrl: 'https://fcd.terra.dev/v1',
    gasPricesUrl: 'https://fcd.terra.dev/v1/txs/gas_prices',
    coinType: '370',
    isTestnet: false,
    chainId: 'columbus-5',
    codeId: 1480,
    supportedAssets,
};

const terra_testnet: TerraNetwork = {
    name: 'testnet',
    networkId: 'testnet',
    rpcUrl: 'https://bombay-lcd.terra.dev',
    helperUrl: 'https://bombay-fcd.terra.dev/v1',
    gasPricesUrl: 'https://bombay-fcd.terra.dev/v1/txs/gas_prices',
    coinType: '370',
    isTestnet: true,
    chainId: 'bombay-12',
    codeId: 23733,
    supportedAssets,
};

const TerraNetworks = {
    terra_mainnet,
    terra_testnet,
};

export { TerraNetworks };
