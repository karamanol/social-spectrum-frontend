import { useQuery } from "@tanstack/react-query";
import { getFriendsOnline } from "../../../services/apiUsers";

export function useGetFriendsOnline() {
  const {
    isFetching,
    data: friendsOnline,
    error,
  } = useQuery({
    queryKey: ["friends-online"],
    queryFn: getFriendsOnline,
  });

  return { friendsOnline, error, isFetching };
}
