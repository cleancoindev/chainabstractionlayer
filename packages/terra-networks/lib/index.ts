import { Network } from '@liquality/types'

export interface TerraNetwork extends Network {
  networkId: string
  nodeUrl: string
  helperUrl: string
  gasPricesUrl: string
  chainID: string
  asset: string
  codeId: number
}

const terra_mainnet: TerraNetwork = {
  name: 'mainnet',
  networkId: 'mainnet',
  nodeUrl: 'https://lcd.terra.dev',
  helperUrl: 'https://fcd.terra.dev/v1',
  gasPricesUrl: 'https://fcd.terra.dev/v1/txs/gas_prices',
  coinType: '397',
  isTestnet: false,
  chainID: 'columbus-5',
  asset: 'luna',
  codeId: 6431 // TODO: Replace after deploying contract on mainnet
}

const terra_testnet: TerraNetwork = {
  name: 'testnet',
  networkId: 'testnet',
  nodeUrl: 'https://bombay-lcd.terra.dev',
  helperUrl: 'https://bombay-fcd.terra.dev/v1',
  gasPricesUrl: 'https://bombay-fcd.terra.dev/v1/txs/gas_prices',
  coinType: '397',
  isTestnet: true,
  chainID: 'bombay-10',
  asset: 'uluna',
  codeId: 7685
}

const TerraNetworks = {
  terra_mainnet,
  terra_testnet
}

export { TerraNetworks }
