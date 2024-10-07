import { useQuery } from "@tanstack/react-query";
import { getWhoIsUserFollowing } from "../../../services/apiRelationships";

export function useGetWhoIsUserFollowing() {
  const {
    isFetching,
    data: followedUsers,
    error,
  } = useQuery({
    queryKey: ["followed-users"],
    queryFn: () => getWhoIsUserFollowing(),
  });

  return { isFetching, followedUsers, error };
}
