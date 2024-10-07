import { useMutation } from "@tanstack/react-query";
import { changeUserVisibility } from "../../../services/apiUsers";

export const useChangeUserVisibility = () => {
  const {
    mutate,
    isPending: isChangingUserVisibility,
    error,
  } = useMutation({
    mutationFn: changeUserVisibility,
  });

  return { mutate, isChangingUserVisibility, error };
};
