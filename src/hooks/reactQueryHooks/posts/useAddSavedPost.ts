import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSavedPost } from "../../../services/apiPosts";

export function useAddSavedPost() {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending: isPostAddingToSaved,
    error,
  } = useMutation({
    mutationFn: addSavedPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { mutate, isPostAddingToSaved, error };
}
