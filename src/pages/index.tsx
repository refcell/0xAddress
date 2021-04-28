import { Box, FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Hero, Container, Main, DarkModeSwitch, Footer, ErrorMessage } from '../components';
import codenamize from '../lib';

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

const Index = () => {
    const [error, setError] = useState('');
    const [address, setAddress] = useState('');

    return (
        <Container minHeight='100vh' height="-webkit-fill-available" overflow='scroll'>
            <Main>
                <Hero />
                <Box m='auto !important' width="fit-content" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <form onSubmit={() => {}}>
                            {error && <ErrorMessage message={error} />}
                            <FormControl>
                                <FormLabel>Enter your wallet address:</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="0x..."
                                    size="lg"
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </FormControl>
                        </form>
                    </Box>
                    <Box my={4} display="flex" width="-webkit-fill-available" alignItems="center" justifyContent="center" p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
                        <Text>{zeroxName(address).length > 0 ? "0x" + zeroxName(address) : "Pseudonym parsed here..."}</Text>
                    </Box>
                </Box>
            </Main>

            <DarkModeSwitch />

            <Footer>
                <Text m={'auto'}>Built with ❤️</Text>
            </Footer>
        </Container>
    )
}

export default Index
