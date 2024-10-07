import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLikeFromPost } from "../../../services/apiLikes";

export const useRemoveLikeFromPost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending: isRemovingLike } = useMutation({
    mutationFn: removeLikeFromPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { mutate, isRemovingLike };
};
