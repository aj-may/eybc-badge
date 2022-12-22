import { Badge, Status } from "@prisma/client";
import { useSiwe } from "@randombits/use-siwe";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { abi, address, badgeContract } from "lib/badgeContract";
import { useContractRead, useSigner } from "wagmi";

const ISSUER_ROLE =
  "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122";

export const useUser = () => {
  const siwe = useSiwe();
  const user = useQuery(
    ["users", siwe.address],
    async () => {
      const res = await axios.get<Omit<Badge, "otp">>(
        `/api/users/${siwe.address}`,
        { validateStatus: (s) => s === 200 || s === 404 }
      );
      if (res.status === 404) return null;
      return res.data;
    },
    { enabled: !!siwe.address }
  );
  const issuer = useContractRead({
    abi,
    address,
    functionName: "hasRole",
    args: [ISSUER_ROLE, siwe.address],
    enabled: !!siwe.address,
  });

  return {
    isLoading:
      siwe.isLoading ||
      (user.isFetching && user.isLoading) ||
      (issuer.isFetching && issuer.isLoading),
    isAuthenticated: siwe.authenticated,
    isIssuer: issuer.data as boolean,
    address: siwe.address,
    ...user.data,
  };
};

export const useUsers = (filter?: Status) => {
  const queryKey = filter ? ["users", filter] : ["users"];
  const url = filter ? `/api/users?status=${filter}` : "/api/users";
  const query = useQuery(queryKey, () => axios.get<Badge[]>(url), {
    select: (res) => res.data,
  });

  return { users: query.data, ...query };
};

export const useRequestBadge = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Pick<Badge, "email" | "handle">) =>
      axios.post<Badge>("/api/users", data),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  return { ...mutation, requestBadge: mutation.mutate };
};

export const useVerifyOTP = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (otp: string) => axios.post<Badge>("/api/verify", { otp }),
    onSuccess: (res) =>
      queryClient.setQueryData(["users", res.data.address], res.data),
  });

  return { ...mutation, verifyOTP: mutation.mutate };
};

export const useIssueBadge = (address: string, id: string) => {
  const queryClient = useQueryClient();
  const { data: signer } = useSigner();
  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Signer not ready");
      const transaction = await badgeContract
        .connect(signer)
        .issue(address, `0x${id}`);

      await transaction.wait();
      await axios.post(`/api/users/${address}/refresh`);
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  return { issueBadge: mutation.mutate, ...mutation };
};

export const useRevokeBadge = (address: string, id: string) => {
  const queryClient = useQueryClient();
  const { data: signer } = useSigner();
  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Signer not ready");
      const transaction = await badgeContract.connect(signer).revoke(`0x${id}`);

      await transaction.wait();
      await axios.post(`/api/users/${address}/refresh`);
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  return { revokeBadge: mutation.mutate, ...mutation };
};

export const useBurnBadge = (address: string, id: string) => {
  const queryClient = useQueryClient();
  const { data: signer } = useSigner();
  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Signer not ready");
      const transaction = await badgeContract.connect(signer).burn(`0x${id}`);

      await transaction.wait();
      await axios.post(`/api/users/${address}/refresh`);
    },
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  return { burnBadge: mutation.mutate, ...mutation };
};

export const useRefreshBadgeStatus = (address: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => axios.post(`/api/users/${address}/refresh`),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  return { refreshStatus: mutation.mutate, ...mutation };
};
