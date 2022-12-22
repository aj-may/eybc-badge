import {
  Center,
  Spinner,
  VStack,
  Text,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useUser } from "lib/hooks/useUser";
import { PropsWithChildren } from "react";
import { FiClock, FiFrown, FiSlash, FiUnlock } from "react-icons/fi";
import { RequestBadgeForm } from "./forms/RequestBadge";
import { VerifyOtpForm } from "./forms/VerifyOtp";

export const RequireBadge = ({ children }: PropsWithChildren) => {
  const { isLoading, isAuthenticated, status, email } = useUser();

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

  if (!status)
    return (
      <HStack gap="5em" wrap="wrap" justifyContent="space-evenly" minH="60vh">
        <VStack gap="1rem">
          <FiFrown size="4rem" />
          <Text fontSize="xl" textAlign="center">
            The connected wallet does
            <br /> not have a Badge
          </Text>
        </VStack>

        <VStack gap=".5rem" alignItems="stretch">
          <Heading size="md">Request a Badge</Heading>
          <Text>
            If you have an EY email address you may
            <br /> request a badge by filling out this form.
          </Text>
          <RequestBadgeForm />
        </VStack>
      </HStack>
    );

  if (status === "UNVERIFIED")
    return (
      <Center minH="60vh">
        <VStack gap=".5rem" alignItems="stretch">
          <Heading size="md">Verify your Email</Heading>
          <Text>
            We sent you a one time passcode to
            <br /> {email}
          </Text>
          <VerifyOtpForm />
        </VStack>
      </Center>
    );

  if (status === "PENDING")
    return (
      <Center minH="60vh">
        <VStack gap="1rem">
          <FiClock size="4rem" />
          <Text fontSize="xl">Your badge request is being reviewed</Text>
        </VStack>
      </Center>
    );

  if (status === "REVOKED")
    return (
      <Center minH="60vh">
        <VStack gap="1rem">
          <FiSlash size="4rem" />
          <Text fontSize="xl">This badge has been revoked</Text>
        </VStack>
      </Center>
    );

  return <>{children}</>;
};
