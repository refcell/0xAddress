import { Flex, FlexProps } from '@chakra-ui/react'

const Footer = (props: FlexProps) => (
    <Flex
        as='footer'
        height='-webkit-fill-available'
        maxHeight={100}
        minHeight={50}
        mt='auto'
        {...props}
        />
)

export default Footer;