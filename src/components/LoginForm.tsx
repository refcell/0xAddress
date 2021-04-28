import React, { useState } from 'react';
import { gql} from '@apollo/client'
import { useMutation, useApolloClient } from '@apollo/client'
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    CircularProgress,
    Text,
    InputGroup,
    InputRightElement,
    Icon
} from '@chakra-ui/react';

// * Local Imports
import { ErrorMessage } from "./";

const SignInMutation = gql`
    mutation SignInMutation($email: String!, $password: String!) {
        signIn(input: { email: $email, password: $password }) {
            user {
                id
                email
            }
        }
    }
`

const LoginForm = () => {
    // * Field inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // * Apollo Client Logic
    const client = useApolloClient()
    const [signIn] = useMutation(SignInMutation)

    const handlePasswordVisibility = () => setShowPassword(!showPassword);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await client.resetStore()
            await signIn({
                variables: {
                    email,
                    password,
                },
            });
            setIsLoggedIn(true);
            setIsLoading(false);
            setShowPassword(false);
            await client.resetStore();
        } catch (error) {
            setError(error.toString());
            setIsLoading(false);
            setEmail('');
            setPassword('');
            setShowPassword(false);
        }
    };

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                {
                    isLoggedIn ? (
                        <Box textAlign="center">
                            <Text>{email} logged in!</Text>
                            <Button
                                colorScheme="orange"
                                variant="outline"
                                width="full"
                                mt={4}
                                onClick={() => setIsLoggedIn(false)}
                            >
                                Sign out
                            </Button>
                        </Box>
                        ) : (
                            <>
                                <Box textAlign="center">
                                    <Heading>Login</Heading>
                                </Box>
                                <Box my={4} textAlign="left">
                                    <form onSubmit={handleSubmit}>
                                        {error && <ErrorMessage message={error} />}
                                        <FormControl isRequired>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                type="email"
                                                placeholder="test@test.com"
                                                size="lg"
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl isRequired mt={6}>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="*******"
                                                    size="lg"
                                                    onChange={e => setPassword(e.target.value)}
                                                />
                                                <InputRightElement width="3rem">
                                                    <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                                                        {showPassword ? <Icon name="view-off" /> : <Icon name="view" />}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                        <Button type="submit" colorScheme="green" variant="outline" width="full" mt={4}>
                                            {
                                                isLoading
                                                ?
                                                (<CircularProgress isIndeterminate size="24px" color="teal" />)
                                                :
                                                ('Sign In')
                                            }
                                        </Button>
                                    </form>
                                </Box>
                            </>
                        )
                }
            </Box>
        </Flex>
    )
}

export default LoginForm