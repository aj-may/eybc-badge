import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  IconButton,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Badge } from "@prisma/client";
import {
  useIssueBadge,
  useRefreshBadgeStatus,
  useRevokeBadge,
} from "lib/hooks/useUser";
import { FiRefreshCw } from "react-icons/fi";

type UserCardProps = {
  user: Badge;
};

const tags = {
  UNVERIFIED: <Tag colorScheme="grey">Unverified</Tag>,
  PENDING: <Tag colorScheme="yellow">Pending</Tag>,
  ISSUED: <Tag colorScheme="green">Issued</Tag>,
  REVOKED: <Tag colorScheme="red">Revoked</Tag>,
};

const IssueAction = ({ user }: UserCardProps) => {
  const { issueBadge, isLoading } = useIssueBadge(user.address, user.id);

  return (
    <Button
      colorScheme="green"
      onClick={() => issueBadge()}
      isLoading={isLoading}
    >
      Issue Badge
    </Button>
  );
};

const RevokeAction = ({ user }: UserCardProps) => {
  const { revokeBadge, isLoading } = useRevokeBadge(user.address, user.id);

  return (
    <Button
      colorScheme="red"
      onClick={() => revokeBadge()}
      isLoading={isLoading}
    >
      Revoke Badge
    </Button>
  );
};

const RefreshAction = ({ user }: UserCardProps) => {
  const { refreshStatus, isLoading } = useRefreshBadgeStatus(user.address);
  return (
    <IconButton
      icon={<FiRefreshCw />}
      aria-label="Refresh Status"
      onClick={() => refreshStatus()}
      isLoading={isLoading}
    />
  );
};

export const UserCard = ({ user }: UserCardProps) => (
  <Card maxW="25rem">
    <CardBody>
      <Flex justifyContent="space-between" alignItems="start" pb="1rem">
        <Heading size="lg">@{user.handle}</Heading>
        {tags[user.status]}
      </Flex>

      <Text>{user.email}</Text>
      <Text fontSize="xs">{user.address}</Text>
    </CardBody>
    <Divider />
    <CardFooter justifyContent="space-between">
      {user.status === "PENDING" ? <IssueAction user={user} /> : null}
      {user.status === "ISSUED" ? <RevokeAction user={user} /> : null}

      {user.status === "PENDING" || user.status === "ISSUED" ? (
        <RefreshAction user={user} />
      ) : null}
    </CardFooter>
  </Card>
);
