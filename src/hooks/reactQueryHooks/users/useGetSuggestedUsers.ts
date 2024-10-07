import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "../../../services/apiUsers";

export function useGetSuggestedUsers() {
  const {
    isFetching,
    data: suggestedUsers,
    error,
  } = useQuery({
    queryKey: ["suggested-users"],
    queryFn: getSuggestedUsers,
  });

  return { suggestedUsers, error, isFetching };
}
