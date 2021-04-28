import { useColorMode, Button } from '@chakra-ui/react'
import { FaRegSun, FaRegMoon } from "react-icons/fa";

const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Button
            position="fixed"
            top="1rem"
            right="1rem"
            color="green"
            onClick={toggleColorMode}
        >
            {isDark ? (<FaRegSun />) : (<FaRegMoon />)}
        </Button>
    )
}

export default DarkModeSwitch;