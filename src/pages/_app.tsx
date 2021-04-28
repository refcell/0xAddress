import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/client'
import theme from '../theme'
import { AppProps } from 'next/app'
import Web3Provider, { Connectors } from 'web3-react'

function MyApp({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps.initialApolloState)
    // * Web3 stuff
    const { InjectedConnector, NetworkOnlyConnector } = Connectors
    const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] })
    const Infura = new NetworkOnlyConnector({
        providerURL: 'https://mainnet.infura.io/v3/...'
    })
    const connectors = { MetaMask, Infura }
    return (
        <ChakraProvider resetCSS theme={theme}>
            <Web3Provider
                connectors={connectors}
                libraryName={'ethers.js'}
                >
                    <ApolloProvider client={apolloClient}>
                        <Component {...pageProps} />
                    </ApolloProvider>
                </Web3Provider>
        </ChakraProvider>
    )
}

export default MyApp
