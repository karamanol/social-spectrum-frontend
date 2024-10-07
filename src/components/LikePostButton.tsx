import { cn } from "../utils/cn";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useAddLikeToPost } from "../hooks/reactQueryHooks/likes/useAddLikeToPost";
import { AxiosError } from "axios";
import SpinnerCircle from "./SpinnerCircle";
import { useRemoveLikeFromPost } from "../hooks/reactQueryHooks/likes/useRemoveLikeFromPost";
import { useNavigate } from "react-router-dom";
import { forceUserToLogIn } from "../hooks/useHandleJwtExpiration";
import { showErrorToast } from "../utils/showErrorToast";

function LikePostButton({
  postId,
  likesNum,
  isPostLikedByCurrentUser,
}: {
  postId: number;
  likesNum: number;
  isPostLikedByCurrentUser: boolean;
}) {
  const { mutate: addLike, isAddingLike } = useAddLikeToPost();
  const { mutate: removeLike, isRemovingLike } = useRemoveLikeFromPost();

  const navigate = useNavigate();

  const handleClickLikeBtn = () => {
    if (isPostLikedByCurrentUser && !isAddingLike && !isRemovingLike) {
      removeLike(
        { postId },
        {
          onError: (err) => {
            if (
              err instanceof AxiosError &&
              err.response?.data?.message === "jwt_error"
            ) {
              forceUserToLogIn(navigate);
            }
            showErrorToast(err);
          },
        }
      );
    } else if (!isPostLikedByCurrentUser && !isAddingLike && !isRemovingLike) {
      addLike(
        { postId },
        {
          onError: (err) => {
            if (
              err instanceof AxiosError &&
              err.response?.data?.message === "jwt_error"
            ) {
              forceUserToLogIn(navigate);
            }
            showErrorToast(err);
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center">
      <div
        className={
          "h-10 w-10 overflow-hidden transition-all drop-shadow-sm hover:scale-110 hover:drop-shadow"
        }>
        <button
          aria-label="Like the post"
          onClick={handleClickLikeBtn}
          disabled={isAddingLike || isRemovingLike}
          className={cn(
            "h-20 w-10 transition-transform duration-300",
            isPostLikedByCurrentUser ? "" : "-translate-y-[50%]"
          )}>
          <div className="h-10 flex justify-center items-center">
            <FcLike className="scale-[180%]" />
          </div>
          <div className="h-10 flex justify-center items-center">
            <FcLikePlaceholder className="scale-[180%] opacity-50" />
          </div>
        </button>
      </div>
      <span className="text-sm flex flex-row mt-1">
        {likesNum ? `${likesNum}${likesNum === 1 ? " Like" : " Likes"}` : null}
        {isAddingLike || isRemovingLike ? (
          <SpinnerCircle iconClassName="h-4 w-4 fill-gray-400 mx-1" />
        ) : null}
      </span>
    </div>
  );
}

export default LikePostButton;
