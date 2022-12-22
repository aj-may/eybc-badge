import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import BadgeMesh from "components/badgeMesh";
import Editable from "components/editable";
import EditableAvatar from "components/editableAvatar";
import { RequireBadge } from "components/RequireBadge";
import { useUser } from "lib/hooks/useUser";

const Page = () => {
  const { handle, avatar, email } = useUser();
  // const { updateHandle, updateAvatar } = useUpdateBadge();

  if (!handle || avatar === undefined) return null;

  return (
    <RequireBadge>
      <Flex gap={10}>
        <Box bg="black" w={350} h={450} borderRadius="lg">
          <Canvas camera={{ position: [0, 0, -10] }}>
            <ambientLight intensity={0.9} />
            <OrbitControls autoRotate />
            <BadgeMesh handle={handle} avatar={avatar} />
          </Canvas>
        </Box>

        <VStack align="stretch" flexGrow={1} spacing={6}>
          <FormControl>
            <FormLabel>Handle</FormLabel>
            <Editable value={handle} onSave={async () => {}} />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>E-Mail</FormLabel>
            <Text fontSize="xl" pl={4}>
              {email}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Avatar</FormLabel>
            <EditableAvatar value={avatar?.url} onSave={async () => {}} />
          </FormControl>
        </VStack>
      </Flex>
    </RequireBadge>
  );
};

export default Page;
