import { MainLayout } from '@/layout/MainLayout'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import CeloLogo from "../../public/rsz_celo.png"
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import merge from 'lodash.merge';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

import "../styles/globals.css"
import '@rainbow-me/rainbowkit/styles.css';

const RPC_URL = process.env.CELO_RPC_URL


const celoAlfajores = {
  id: 44787,
  name: 'celoAlfajores',
  network: 'celoAlfajores',
  iconUrl: CeloLogo,
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO'
  },
  rpcUrls: {
    default: RPC_URL
  },
  blockExplorers: {
    etherscan: { name: 'Celo Scan', url: 'https://alfajores.celoscan.io/' },
    default: {name: 'Celo Scan', url: 'https://alfajores.celoscan.io/' },
  },
  contracts: {},
  testnet: true,
}

const { provider, chains } = configureChains(
  [celoAlfajores],
  [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Decentainment',
    wallets: [
      metaMaskWallet({ chains })
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const customTheme = merge(lightTheme(), {
  colors: {
    modalBackground: "#FEF0FF"
  }
})



export default function App({ Component, pageProps }) {
  return(
    <ChakraProvider>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains} modalSize="compact" theme={customTheme}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  )
}
