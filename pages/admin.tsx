import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Status } from "@prisma/client";
import { RequireIssuerRole } from "components/RequireIssuerRole";
import { UserCard } from "components/UserCard";
import { useUsers } from "lib/hooks/useUser";
import { useState } from "react";

const Page = () => {
  const [filter, setFilter] = useState<Status | undefined>(undefined);
  const { isLoading, users } = useUsers(filter);

  return (
    <RequireIssuerRole>
      <VStack gap="1rem" alignItems="start">
        <ButtonGroup isAttached>
          <Button
            onClick={() => setFilter(undefined)}
            isActive={filter === undefined}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("UNVERIFIED")}
            isActive={filter === "UNVERIFIED"}
          >
            Unverified
          </Button>
          <Button
            onClick={() => setFilter("PENDING")}
            isActive={filter === "PENDING"}
          >
            Pending
          </Button>
          <Button
            onClick={() => setFilter("ISSUED")}
            isActive={filter === "ISSUED"}
          >
            Issued
          </Button>
          <Button
            onClick={() => setFilter("REVOKED")}
            isActive={filter === "REVOKED"}
          >
            Revoked
          </Button>
        </ButtonGroup>

        {users && users.length > 0 ? (
          <Flex>
            {users.map((user) => (
              <UserCard user={user} key={user.id} />
            ))}
          </Flex>
        ) : (
          <Center minH="40vh" width="100%">
            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <Text fontSize="xl">No results to display.</Text>
            )}
          </Center>
        )}
      </VStack>
    </RequireIssuerRole>
  );
};

export default Page;
