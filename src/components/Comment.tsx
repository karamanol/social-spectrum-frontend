import { Link } from "react-router-dom";
import { PostCommentType } from "./Comments";
import defaultUserImage from "../assets/default-user.jpg";
import { intlFormatDistance } from "date-fns";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useAuth } from "../context/authContext";
import { useDeleteComment } from "../hooks/reactQueryHooks/comments/useDeleteComment";
import { cn } from "../utils/cn";

function Comment({ comment }: { comment: PostCommentType }) {
  const { mutate: deleteComment, isDeletingComment } = useDeleteComment();
  const { currentUser } = useAuth();

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId);
  };
  return (
    <li
      key={comment.id}
      className="flex gap-2 overflow-x-auto p-2 sm:p-3 drop-shadow-sm">
      <div className="min-w-8 min-h-8">
        <img
          src={comment.profilePicture || defaultUserImage}
          alt={comment.name}
          className="h-8 w-8 rounded-full object-cover bg-gray-200 dark:bg-gray-400"
        />
      </div>
      <div className=" bg-gray-100 dark:bg-[#282C34] rounded-xl rounded-ss-none px-5 pb-3 pt-1">
        <footer className="flex justify-between items-center">
          <Link
            to={`/profile/${comment.userId}`}
            className="font-semibold text-sm text-neutral-900 dark:text-inherit mr-5 hover:underline">
            {comment.name}
          </Link>

          <span className="text-xs text-gray-500">
            {intlFormatDistance(comment.createdAt, new Date())}
          </span>
        </footer>
        <p className="mt-1">{comment.textContent}</p>
      </div>
      {currentUser?.id === comment.userId || currentUser?.role === "admin" ? (
        <button
          disabled={isDeletingComment}
          onClick={() => handleDeleteComment(comment.id)}
          className={cn(
            "text-gray-500 self-center hover:text-red-800 p-1",
            isDeletingComment ? "animate-bounce text-red-800" : null
          )}>
          <MdOutlineDeleteOutline />
        </button>
      ) : null}
    </li>
  );
}

export default Comment;
