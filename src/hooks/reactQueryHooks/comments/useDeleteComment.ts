import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../../services/apiComments";

export function useDeleteComment() {
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeletingComment } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { mutate, isDeletingComment };
}
