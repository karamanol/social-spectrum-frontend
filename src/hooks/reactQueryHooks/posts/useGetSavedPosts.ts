import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "../../../services/apiPosts";

export function useGetSavedPosts() {
  const {
    isLoading,
    data: savedPosts,
    error,
  } = useQuery({
    queryKey: ["saved_posts"],
    queryFn: getSavedPosts,
  });

  return { isLoading, savedPosts, error };
}
