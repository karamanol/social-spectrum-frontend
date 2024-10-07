import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../../services/apiUsers";

export function useFindUser(userId: string) {
  const {
    isPending,
    isFetching,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser({ userId }),
  });

  return { isPending, user, error, isFetching };
}
