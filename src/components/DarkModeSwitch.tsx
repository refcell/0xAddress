import { useColorMode, Button } from '@chakra-ui/react'
import { FaRegSun, FaRegMoon } from "react-icons/fa";

const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    return (
        <Button
            color="green"
            onClick={toggleColorMode}
        >
            {isDark ? (<FaRegSun />) : (<FaRegMoon />)}
        </Button>
    )
}

export default DarkModeSwitch;