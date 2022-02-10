import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { Chains } from '../../common';

export function shouldBehaveLikeBitcoinClient() {
    before(async () => {
        // await deploy(EthereumClient);
    });

    describe('Bitcoin Client', () => {
        shouldBehaveLikeChainProvider(Chains.btc);
        // shouldBehaveLikeWalletProvider(EthereumClient, EVMConfig);
    });
}
