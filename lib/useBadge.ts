import { Badge } from "@prisma/client";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { erc721ABI, useContractRead } from "wagmi";

const fetchBadge: QueryFunction<Badge> = async ({ queryKey }) => {
  const tokenId = queryKey[1] as string;
  const { data } = await axios.get(`/api/badges/${tokenId}`);
  return data;
};

export default function useBadge(addressOrName: string = '0x95e6603e219e6D08A9AE46f29201fA1610FA76B4') {
  const { status: sessionStatus, data: sessionData } = useSession();
  const address = sessionData ? (sessionData.address as string) : undefined;
  const { data: tokenId, isLoading: tokenIdLoading } = useContractRead({
    addressOrName: addressOrName,
    contractInterface: erc721ABI,
    functionName: "tokenOfOwnerByIndex",
    args: [address, 0],
    enabled: !!address,
  });
  const { data: badge, isLoading: badgeLoading } = useQuery(['badge', tokenId], fetchBadge, {
    enabled: !!tokenId,
  });

  const isAuthenticated = sessionStatus === "authenticated";
  const isLoading = sessionStatus === "loading" || tokenIdLoading || (badgeLoading && !!tokenId);
  const hasBadge = !!tokenId;

  return { isAuthenticated, isLoading, hasBadge, tokenId, badge };
}
