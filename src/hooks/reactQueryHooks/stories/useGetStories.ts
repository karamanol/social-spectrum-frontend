import { useQuery } from "@tanstack/react-query";
import { getStories } from "../../../services/apiStories";

export function useGetStories() {
  const {
    isLoading,
    data: stories,
    error,
  } = useQuery({
    queryKey: ["stories"],
    queryFn: getStories,
  });

  return { isLoading, stories, error };
}
