import React, { useState } from 'react';
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
import { gql, useApolloClient, useMutation } from '@apollo/client'
import validator from 'validator'

// * Local Imports
import { ErrorMessage } from "./";

const SignUpMutation = gql`
    mutation SignUpMutation($email: String!, $firstName: String!, $lastName: String!, $dob: String!, $password: String!) {
        signUp(input: { email: $email, firstName: $firstName, lastName: $lastName, dob: $dob, password: $password }) {
            user {
                id
                email
            }
        }
    }
`

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

const SignUpForm = () => {
    // * Apollo Logic
    const [signUp] = useMutation(SignUpMutation)
    const [signIn] = useMutation(SignInMutation)
    const client = useApolloClient()

    // * Field inputs
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [strongPassword, setStrongPassword] = useState(true);

    // * Password validation logic
    const validate = (value: string) => {
        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setStrongPassword(true)
        } else {
            setStrongPassword(false)
        }
    }

    const handlePasswordVisibility = () => setShowPassword(!showPassword);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await client.resetStore()
            const res = await signUp({
                variables: {
                    email,
                    firstName,
                    lastName,
                    dob,
                    password
                },
            })
            setIsSignedUp(true);
            setIsLoading(false);
            setShowPassword(false);
            await client.resetStore()
            await signIn({
                variables: {
                    email,
                    password,
                },
            });
            await client.resetStore();
        } catch (error) {
            setError(error.toString());
            setIsLoading(false);
            setEmail('');
            setFirstName('');
            setLastName('');
            setDob('');
            setPassword('');
            setShowPassword(false);
        }
    };

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                {
                    isSignedUp ? (
                        <Box textAlign="center">
                            <Text>{email} logged in!</Text>
                            <Button
                                colorScheme="orange"
                                variant="outline"
                                width="full"
                                mt={4}
                                onClick={() => setIsSignedUp(false)}
                            >
                                Sign out
                            </Button>
                        </Box>
                        ) : (
                            <>
                                <Box textAlign="center">
                                    <Heading>Sign Up</Heading>
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
                                        <FormControl isRequired>
                                            <FormLabel>First Name</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="John"
                                                size="lg"
                                                onChange={e => setFirstName(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Last Name</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="Smith"
                                                size="lg"
                                                onChange={e => setLastName(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <Input
                                                type="date"
                                                // placeholder="Smith"
                                                size="lg"
                                                onChange={e => setDob(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl isRequired mt={6}>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="*******"
                                                    size="lg"
                                                    onChange={e => { setPassword(e.target.value); validate(e.target.value);}}
                                                />
                                                <InputRightElement width="3rem">
                                                    <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                                                        {showPassword ? <Icon name="view-off" /> : <Icon name="view" />}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            {!strongPassword && <ErrorMessage message={'Must input strong password with at least: 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol'} />}
                                        </FormControl>
                                        <Button type="submit" colorScheme="green" variant="outline" width="full" mt={4}>
                                            {
                                                isLoading
                                                ?
                                                (<CircularProgress isIndeterminate size="24px" color="teal" />)
                                                :
                                                ('Sign Up')
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

export default SignUpForm;
