import { Chains } from '../../common';

import { shouldBehaveLikeChainProvider } from '../../chain/chain.test';
import { shouldBehaveLikeWalletProvider } from '../../wallet/wallet.test';
import { shouldBehaveLikeSwapProvider } from '../../swap/swap.test';

export function shouldBehaveLikeNearClient() {
    describe('Terra Client', () => {
        shouldBehaveLikeChainProvider(Chains.terra);
        shouldBehaveLikeWalletProvider(Chains.terra);
        shouldBehaveLikeSwapProvider(Chains.terra);
    });
}
