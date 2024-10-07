import { useMutation } from "@tanstack/react-query";
import { addStory } from "../../../services/apiStories";

export const useAddStory = () => {
  const {
    mutate,
    isPending: isUploadingStory,
    error,
  } = useMutation({
    mutationFn: addStory,
  });

  return { mutate, isUploadingStory, error };
};
