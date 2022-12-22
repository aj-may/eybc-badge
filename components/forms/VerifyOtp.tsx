import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useVerifyOTP } from "lib/hooks/useUser";
import { verifyOtpSchema } from "lib/models";

type Request = z.infer<typeof verifyOtpSchema>;

export const VerifyOtpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Request>({
    resolver: zodResolver(verifyOtpSchema),
  });
  const { verifyOTP, isLoading, isError, error } = useVerifyOTP();
  const onSubmit: SubmitHandler<Request> = (data) => verifyOTP(data.otp);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="1rem">
        <FormControl isInvalid={!!errors.otp}>
          <FormLabel>Code</FormLabel>
          <Input type="text" {...register("otp")} size="lg" />
          <FormErrorMessage>{errors.otp?.message}</FormErrorMessage>
        </FormControl>

        <FormControl textAlign="right" isInvalid={isError}>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Verify
          </Button>
          {isError ? (
            <FormErrorMessage>{(error as Error).message}</FormErrorMessage>
          ) : null}
        </FormControl>
      </Flex>
    </form>
  );
};
