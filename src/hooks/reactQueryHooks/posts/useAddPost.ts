import { useMutation } from "@tanstack/react-query";
import { addPost } from "../../../services/apiPosts";

export function useAddPost() {
  const { mutate, isPending: isAddingPost } = useMutation({
    mutationFn: addPost,
  });

  return { mutate, isAddingPost };
}
