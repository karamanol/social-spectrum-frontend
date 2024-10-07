import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStoryById } from "../../../services/apiStories";

export function useDeleteStory() {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending: isDeletingStory,
    error,
  } = useMutation({
    mutationFn: deleteStoryById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stories"] }),
  });

  return { mutate, isDeletingStory, error };
}
