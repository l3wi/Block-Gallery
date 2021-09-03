import { Web3Provider } from "../contexts/useWeb3"
import { useWallet, UseWalletProvider } from "use-wallet"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
// import { client } from "../utils/graph"
import { AlertProvider } from "../contexts/useAlerts"

import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react"
import { NftProvider, useNft } from "use-nft"
import { web3 } from "../utils/ethers"

// const ethersConfig = {
//   provider: new ethers.providers.InfuraProvider("homestead", process.env.INFURA)
// }

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
const client = new ApolloClient({
  uri: process.env.AB_GRAPH,
  cache: new InMemoryCache()
})

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendTheme({ theme })}>
      <CSSReset />
      <UseWalletProvider
        chainId={process.env.CHAIN_ID}
        connectors={{
          walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
          walletlink: { url: "https://mainnet.eth.aragon.network/" }
        }}
      >
        <AlertProvider>
          <ApolloProvider client={client}>
            <Web3Provider>
              <NftProvider fetcher={["ethers", { provider: web3 }]}>
                <Component {...pageProps} />
              </NftProvider>
            </Web3Provider>
          </ApolloProvider>
        </AlertProvider>
      </UseWalletProvider>
    </ChakraProvider>
  )
}
