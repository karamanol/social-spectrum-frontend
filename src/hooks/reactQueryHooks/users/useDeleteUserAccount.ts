import { useMutation } from "@tanstack/react-query";
import { deleteUserAccountById } from "../../../services/apiUsers";

export const useDeleteUserAccount = () => {
  const {
    mutate,
    isPending: isDeletingAccount,
    error,
  } = useMutation({
    mutationFn: deleteUserAccountById,
  });

  return { mutate, isDeletingAccount, error };
};
