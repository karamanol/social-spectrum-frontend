import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSavedPost } from "../../../services/apiPosts";

export function useDeleteSavedPost() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending: isPostDeletingFromSaved,
    error,
  } = useMutation({
    mutationFn: deleteSavedPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { mutate, isPostDeletingFromSaved, error };
}
