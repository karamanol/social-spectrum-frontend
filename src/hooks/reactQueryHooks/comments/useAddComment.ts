import { useMutation } from "@tanstack/react-query";
import { addComment } from "../../../services/apiComments";

export function useAddComment() {
  const { mutate, isPending: isAddingComment } = useMutation({
    mutationFn: addComment,
  });

  return { mutate, isAddingComment };
}
