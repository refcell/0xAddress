import { useColorMode, Button, Stack } from '@chakra-ui/react'
import { FaRegSun, FaRegMoon } from "react-icons/fa";

const SignOut = ({ handleSignOut }: { handleSignOut: any }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Stack
            direction={"row"}
            position="fixed"
            top="1rem"
            right="1rem"
        >
            <Button onClick={handleSignOut}>
                Sign Out
            </Button>
            <Button
                color="green"
                onClick={toggleColorMode}
            >
                {isDark ? (<FaRegSun />) : (<FaRegMoon />)}
            </Button>
        </Stack>
    )
}

export default SignOut;