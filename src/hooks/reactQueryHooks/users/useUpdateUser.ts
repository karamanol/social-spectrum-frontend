import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "../../../services/apiUsers";

export const useUpdateUser = () => {
  const {
    mutate,
    isPending: isUpdatingUser,
    error,
  } = useMutation({
    mutationFn: updateUserInfo,
  });

  return { mutate, isUpdatingUser, error };
};
