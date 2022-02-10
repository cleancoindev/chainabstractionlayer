import { Network } from '@liquality/types';

export interface SupportedAsset {
    asset: string;
    feeAsset: string;
    tokenAddress?: string;
    stableFee?: boolean;
}

export interface SupportedAssets {
    [key: string]: SupportedAsset;
}

export interface TerraNetwork extends Network {
    helperUrl: string;
    gasPricesUrl: string;
    codeId: number;
    supportedAssets: SupportedAssets;
}

export interface InputTransaction {
    buyer?: string;
    seller?: string;
    expiration?: number;
    value?: number;
    secret_hash?: string;
    secret?: string;
    contractAddress?: string;
    method?: {
        claim?: {
            secret: string;
        };
        refund?: () => void;
    };
    confirmations?: number;
    codeId?: number;
}
