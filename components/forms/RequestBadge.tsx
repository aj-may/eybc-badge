import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { badgeSchema } from "lib/models";
import { z } from "zod";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useRequestBadge } from "lib/hooks/useUser";

const schema = badgeSchema.pick({ handle: true, email: true });
type Request = z.infer<typeof schema>;

export const RequestBadgeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Request>({
    resolver: zodResolver(schema),
  });
  const { requestBadge, isLoading, isError, error } = useRequestBadge();
  const onSubmit: SubmitHandler<Request> = (data) => requestBadge(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="1rem">
        <FormControl isInvalid={!!errors.handle}>
          <FormLabel>Handle</FormLabel>
          <InputGroup size="lg">
            <InputLeftAddon>@</InputLeftAddon>
            <Input type="text" {...register("handle")} />
          </InputGroup>
          <FormErrorMessage>{errors.handle?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register("email")} size="lg" />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl textAlign="right" isInvalid={isError}>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Request Badge
          </Button>
          {isError ? (
            <FormErrorMessage>{(error as Error).message}</FormErrorMessage>
          ) : null}
        </FormControl>
      </Flex>
    </form>
  );
};
