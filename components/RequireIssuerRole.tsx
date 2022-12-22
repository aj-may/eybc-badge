import { Center, Spinner, VStack, Text } from "@chakra-ui/react";
import { useUser } from "lib/hooks/useUser";
import { PropsWithChildren } from "react";
import { FiLock, FiUnlock } from "react-icons/fi";

export const RequireIssuerRole = ({ children }: PropsWithChildren) => {
  const { isLoading, isAuthenticated, isIssuer } = useUser();

  if (isLoading)
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!isAuthenticated)
    return (
      <Center minH="60vh">
        <VStack gap="1rem">
          <FiUnlock size="4rem" />
          <Text fontSize="xl">Connect your wallet to continue...</Text>
        </VStack>
      </Center>
    );

  if (!isIssuer)
    return (
      <Center minH="60vh">
        <VStack gap="1rem">
          <FiLock size="4rem" />
          <Text fontSize="xl">
            You must be an authorized issuer to access this page
          </Text>
        </VStack>
      </Center>
    );

  return <>{children}</>;
};
