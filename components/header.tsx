import { Box, Container, Flex, Hide, Spacer, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => <Box py={4}>
  <Container maxW="container.lg">
    <Flex align="center">
      <Text fontSize="2xl">
        <Hide below="sm">EY Blockchain </Hide>Badge Editor
      </Text>
      <Spacer />
      <ConnectButton showBalance={false} />
    </Flex>
  </Container>
</Box>;

export default Header;