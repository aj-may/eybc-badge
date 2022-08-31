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
  Image,
  IconButton,
} from "@chakra-ui/react"
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import BadgeMesh from "components/badgeMesh";
import Editable from "components/editable";
import Header from "components/header";
import useBadge from "lib/useBadge";
import { FiEdit } from "react-icons/fi";

const wait = (seconds: number) => new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));

const Page = () => {
  const { isLoading, isAuthenticated, hasBadge, badge } = useBadge();

  const handleSave = async (value: string) => {
    await wait(3);
  }

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
            <Editable value={badge.handle} onSave={handleSave} />
          </FormControl>
          
          <FormControl isReadOnly>
            <FormLabel>E-Mail</FormLabel>
            <Text fontSize="xl" pl={4}>{badge.email}</Text>
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Avatar</FormLabel>
            <Flex py={4} justifyContent="center">
              <Image
                src={badge.photo ? badge.photo : '/img/user.png'}
                borderRadius="full"
                boxSize="175px"
                alt="Your Avatar"
              />
              <IconButton
                aria-label="Edit"
                icon={<FiEdit />}
                variant="ghost"
              />
            </Flex>
          </FormControl>
        </VStack>
      </Flex>
    </Container>
  </>;
};

export default Page;