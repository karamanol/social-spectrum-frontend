import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../../services/apiPosts";

export function useGetPosts(onlyFromGivenUserId?: string) {
  const {
    isLoading,
    data: posts,
    error,
  } = useQuery({
    queryKey: ["posts", onlyFromGivenUserId],
    queryFn: () => getPosts(onlyFromGivenUserId),
  });

  return { isLoading, posts, error };
}
