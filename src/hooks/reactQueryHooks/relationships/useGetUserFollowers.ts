import { useQuery } from "@tanstack/react-query";
import { getUserFollowers } from "../../../services/apiRelationships";

export function useGetUserFollowers(userId: string | undefined) {
  const {
    isFetching,
    data: followers,
    error,
  } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getUserFollowers({ userId }),
  });

  return { isFetching, followers, error };
}
