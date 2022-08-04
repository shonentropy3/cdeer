import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
 });

const walletconnect = new WalletConnectConnector({
  rpcUrl: "https://goerli.infura.io/v3/d3fe47cdbf454c9584113d05a918694f",
  // rpcUrl: "https://goerli.infura.io/v3/4bf032f2d38a4ed6bb975b80d6340847",
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/d3fe47cdbf454c9584113d05a918694f`,
  appName: "web3-react-demo"
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};
