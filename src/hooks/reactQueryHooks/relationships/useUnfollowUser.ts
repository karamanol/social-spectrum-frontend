import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "../../../services/apiRelationships";

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending: isLoadingUnfollowUser,
    error,
  } = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followed-users"] });
      queryClient.invalidateQueries({ queryKey: ["friends-online"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] });
    },
  });

  return { mutate, isLoadingUnfollowUser, error };
};
