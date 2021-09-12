import { Web3Provider } from "../contexts/useWeb3"
import { useWallet, UseWalletProvider } from "use-wallet"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { AlertProvider } from "../contexts/useAlerts"

import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react"

const theme = {
  styles: {
    global: {
      "html, body": {
        minHeight: "100vh",
        fontSize: "sm",
        color: "gray.600",
        lineHeight: "tall"
      },
      a: {
        color: "teal.500"
      }
    }
  }
}

const CHAIN_ID = process.env.CHAIN_ID ? process.env.CHAIN_ID : 1
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendTheme({ theme })}>
      <CSSReset />
      <UseWalletProvider
        chainId={CHAIN_ID}
        connectors={{
          walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
          walletlink: { url: "https://mainnet.eth.aragon.network/" }
        }}
      >
        <AlertProvider>
          {/* <ApolloProvider client={client}> */}
          <Web3Provider>
            <Component {...pageProps} />
          </Web3Provider>
          {/* </ApolloProvider> */}
        </AlertProvider>
      </UseWalletProvider>
    </ChakraProvider>
  )
}
