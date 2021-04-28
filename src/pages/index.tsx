import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import { CopyIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useWeb3Context } from 'web3-react'
import Web3 from 'web3';

import { Hero, Container, Main, DarkModeSwitch, Footer, ErrorMessage } from '../components';
import codenamize from '../lib';

const Index = () => {
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // * web3
    const context = useWeb3Context()
    const [address, setAddress] = useState('');
    const [isConnected, setConnectedStatus] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const async_func = async () => {
                    // @ts-ignore
                    const accounts = await window.ethereum.request({ method: "eth_accounts" })
                    if (accounts.length) {
                        setConnectedStatus(true);
                        setAddress(accounts[0]);
                    } else {
                        setConnectedStatus(false);
                        setStatus("🦊 Connect to Metamask using the top right button.");
                    }
                }
                async_func();
            } catch {
                setConnectedStatus(false);
                setStatus(
                "🦊 Connect to Metamask using the top right button. " +
                    address
                );
            }
        }
    });

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet(isConnected);
        setConnectedStatus(walletResponse.connectedStatus);
        setStatus(walletResponse.status);
        if (isConnected) {
            setAddress(address);
        }
    };

    return (
        <Container minHeight='100vh' height="-webkit-fill-available" overflow='scroll'>
            <Box position="fixed"
                    top="1rem"
                    right="2rem">
                <Button
                    variant='outline'
                    colorScheme='blue'
                    id='walletButton'
                    mx={4}
                    onClick={connectWalletPressed}
                    >
                    {isConnected ? (
                        "👛 Connected: " +
                        String(address).substring(0, 6) +
                        "..." +
                        String(address).substring(38)
                        ) : (
                            <span>👛 Connect Wallet</span>
                            )}
                </Button>
                <DarkModeSwitch />
            </Box>

            <Main>
                <Hero />
                <Box m='auto !important' width="fit-content" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <Box width="-webkit-fill-available" display="flex" alignItems="center" justifyContent="center">
                        <form style={{width: "-webkit-fill-available"}} onSubmit={() => {}}>
                            {error && <ErrorMessage message={error} />}
                            <FormControl width="-webkit-fill-available">
                                <FormLabel>Enter your wallet address:</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="0x..."
                                    size="lg"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </FormControl>
                        </form>
                    </Box>
                    <Box
                        onClick={() => {
                            setCopied(true);
                            navigator.clipboard.writeText("0x" + zeroxName(address));
                            setTimeout(() => setCopied(false), 400);
                        }}
                        cursor='pointer'
                        my={4}
                        display="flex"
                        width="-webkit-fill-available"
                        alignItems="center"
                        justifyContent="center"
                        p={4}
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow="lg">
                            <Text>{zeroxName(address).length > 0 ? "0x" + zeroxName(address) : "Pseudonym parsed here..."}</Text>
                            {copied ? (<CheckCircleIcon ml='auto' />) : (<CopyIcon ml='auto' />)}
                    </Box>
                    <Box display="flex" width="-webkit-fill-available" alignItems="center" justifyContent="center">
                        <ErrorMessage width='-webkit-fill-available' message={'Warning: This address is solely for fun and CANNOT be used to send funds! The creators of this tool are not responsible for any damages.'} />
                    </Box>
                </Box>
            </Main>

            <Footer>
                <Text m={'auto'}>Built with ❤️ by <a target="_blank" href="https://github.com/abigger87" rel="noopener noreferrer">Andreas Bigger</a></Text>
            </Footer>
        </Container>
    )
}

const isAddress = (address: string) => {
    return /^(0x)?[0-9a-f]{40}$/i.test(address)
}

const zeroxName = (address: string) => {
    let name = ''
    address = String(address).toLowerCase()

    if (address.substring(0, 2) !== '0x') {
        address = '0x' + address
    }

    if (isAddress(address)) {
        name = codenamize(
        {
            seed: address,
            adjectiveCount: 2,
            maxItemChars: 5,
            capitalize: true,
            separator: ''
        })
    }

    return name
}

export const connectWallet = async (isConnected) => {
    // @ts-ignore
    if (window.ethereum) {
        if(isConnected) {
            // * try to disconnect
            // @ts-ignore
            const address = await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{
                    eth_accounts: {},
                }]
            });
            // * If user still signed in, we have an address
            if(address) {
                return {
                    connectedStatus: true,
                    status: "",
                    address: address
                }
            }
            // * Otherwise, signed out
            return {
                connectedStatus: false,
                status: "🦊 Connect to Metamask using the button on the top right."
            }
        } else {
            try {
                // @ts-ignore
                const address = await window.ethereum.send('eth_requestAccounts');
                // @ts-ignore
                window.web3 = new Web3(window.ethereum);
                // const address = await window.ethereum.enable();
                const obj = {
                        connectedStatus: true,
                        status: "",
                        address: address
                    }
                    return obj;
            } catch (error) {
                return {
                    connectedStatus: false,
                    status: "🦊 Connect to Metamask using the button on the top right."
                }
            }
        }
    } else {
        return {
            connectedStatus: false,
            status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
        }
    }
};

export default Index
