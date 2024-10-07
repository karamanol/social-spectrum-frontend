import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeAPost } from "../../../services/apiLikes";

export const useAddLikeToPost = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending: isAddingLike } = useMutation({
    mutationFn: likeAPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { mutate, isAddingLike };
};
