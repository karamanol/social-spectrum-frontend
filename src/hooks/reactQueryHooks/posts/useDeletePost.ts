import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../../services/apiPosts";

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeletingPost } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  return { mutate, isDeletingPost };
}
