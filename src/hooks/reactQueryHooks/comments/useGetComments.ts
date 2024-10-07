import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../../services/apiComments";

export const useGetComments = ({ postId }: { postId: number }) => {
  const {
    isLoading,
    data: comments,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments({ postId }),
  });

  return { isLoading, comments, error };
};
