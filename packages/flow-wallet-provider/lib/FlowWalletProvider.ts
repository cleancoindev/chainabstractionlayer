// import { WalletProvider } from "@liquality/wallet-provider";
// import { Address, ChainProvider } from "@liquality/types";
// export default class FlowWalletProvider extends WalletProvider implements Partial<ChainProvider> {
//     isWalletAvailable(): Promise<boolean> {
//         throw new Error("Method not implemented.");
//     }
//     getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]> {
//         throw new Error("Method not implemented.");
//     }
//     getUsedAddresses(numAddressPerCall?: number): Promise<Address[]> {
//         throw new Error("Method not implemented.");
//     }
//     getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address> {
//         throw new Error("Method not implemented.");
//     }
//     signMessage(message: string, from: string): Promise<string> {
//         throw new Error("Method not implemented.");
//     }
//     getConnectedNetwork(): Promise<any> {
//         throw new Error("Method not implemented.");
//     }

// sendTransaction(options: SendOptions): Promise<Transaction<any>> {
//   throw new Error('Method not implemented.')
// }
// sendSweepTransaction(address: string | Address, fee?: number): Promise<Transaction<any>> {
//   throw new Error('Method not implemented.')
// }
// }
