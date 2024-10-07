import { useQuery } from "@tanstack/react-query";
import { getStoriesByUserId } from "../../../services/apiStories";

export function useGetStoriesByUserId(userId: number) {
  const {
    isLoading,
    data: stories,
    error,
  } = useQuery({
    queryKey: ["stories", userId],
    queryFn: () => {
      if (!userId)
        throw new Error("User session is corrupted. Try to log in again.");
      return getStoriesByUserId(userId);
    },
  });

  return { isLoading, stories, error };
}
