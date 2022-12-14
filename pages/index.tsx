import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Spinner,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react"
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import BadgeMesh from "components/badgeMesh";
import Editable from "components/editable";
import EditableAvatar from "components/editableAvatar";
import Header from "components/header";
import useBadge, { useUpdateBadge } from "lib/useBadge";

const Page = () => {
  const { isLoading, isAuthenticated, hasBadge, badge } = useBadge();
  const { updateHandle, updateAvatar } = useUpdateBadge();

  if (isLoading) return <>
    <Header />

    <Center h={500}>
      <Spinner size='xl' />
    </Center>
  </>;

  if (!isAuthenticated) return <>
    <Header />

    <Center h={500}>
      <Text fontSize="xl">Connect your wallet to continue...</Text>
    </Center>
  </>;

  if (!hasBadge || !badge) return <>
    <Header />

    <Center h={500}>
      <Text fontSize="xl">The connected wallet does not have an EY Blockchain Badge 😥</Text>
    </Center>
  </>;

  return <>
    <Header />

    <Container maxW="container.md" pt="10vh" pb={10}>
      <Flex gap={10}>
        <Box bg="black" w={350} h={450} borderRadius="lg">
          <Canvas camera={{ position: [0,0,-10]}}>
            <ambientLight intensity={0.9} />
            <OrbitControls autoRotate />
            <BadgeMesh {...badge} />
          </Canvas>
        </Box>

        <VStack align="stretch" flexGrow={1} spacing={6}>
          <FormControl>
            <FormLabel>Handle</FormLabel>
            <Editable value={badge.handle} onSave={updateHandle} />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>E-Mail</FormLabel>
            <Text fontSize="xl" pl={4}>{badge.email}</Text>
          </FormControl>

          <FormControl>
            <FormLabel>Avatar</FormLabel>
            <EditableAvatar value={badge.avatar?.url} onSave={updateAvatar} />
          </FormControl>
        </VStack>
      </Flex>
    </Container>
  </>;
};

export default Page;
