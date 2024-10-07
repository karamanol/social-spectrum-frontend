import { useGetComments } from "../hooks/reactQueryHooks/comments/useGetComments";
import AddCommentForm from "./AddCommentForm";
import Comment from "./Comment";
import SpinnerCircle from "./SpinnerCircle";

export type PostCommentType = {
  id: number;
  postId: number;
  userId: number;
  textContent: string;
  createdAt: Date;
  commentUserId: number;
  name: string;
  profilePicture?: string;
};

function Comments({ postId }: { postId: number }) {
  const { comments, error, isLoading } = useGetComments({ postId });

  if (error) {
    return (
      <div className="flex items-center justify-center p-3 rounded-md bg-red-500/50">
        Cannot load comments right now
      </div>
    );
  }

  return (
    <div className="dark:border-[#282C34] pt-3">
      {/* ADD COMMENT */}
      <div className="">
        <AddCommentForm className="" postId={postId} />
      </div>

      {/* COMMENTS */}
      {isLoading ? (
        <SpinnerCircle
          iconClassName={"dark:fill-violet-400/80 dark:text-gray-400"}
        />
      ) : (
        <div className="max-h-[28rem] overflow-y-auto">
          <ul className="flex flex-col">
            {Array.isArray(comments) && comments.length
              ? comments.map((comment) => {
                  return <Comment comment={comment} key={comment.id} />;
                })
              : null}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Comments;
