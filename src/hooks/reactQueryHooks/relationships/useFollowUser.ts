import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser } from "../../../services/apiRelationships";

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending: isLoadingFollowUser,
    error,
  } = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] });
      queryClient.invalidateQueries({ queryKey: ["followed-users"] });
      queryClient.invalidateQueries({ queryKey: ["friends-online"] });
    },
  });

  return { mutate, isLoadingFollowUser, error };
};
