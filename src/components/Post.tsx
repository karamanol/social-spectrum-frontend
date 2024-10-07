import { IoIosMore } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import LikePostButton from "./LikePostButton";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegCommentDots,
  FaRegShareFromSquare,
} from "react-icons/fa6";
import Comments from "./Comments";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import defaultProfilePic from "../assets/default-user.jpg";
import { intlFormatDistance } from "date-fns";
import { useAuth } from "../context/authContext";
import { cn } from "../utils/cn";
import { useDeletePost } from "../hooks/reactQueryHooks/posts/useDeletePost";
import { AxiosError } from "axios";
import { forceUserToLogIn } from "../hooks/useHandleJwtExpiration";
import Swal from "sweetalert2";
import { getErrorMessage } from "../utils/getErrorMessage";
import SpinnerCircle from "./SpinnerCircle";
import ImageWithBlurhash from "./ImageWithBlurhash";
import { useDeleteSavedPost } from "../hooks/reactQueryHooks/posts/useDeleteSavedPost";
import { useAddSavedPost } from "../hooks/reactQueryHooks/posts/useAddSavedPost";

export type PostType = {
  id: number;
  userId: number;
  textContent: string;
  image?: string;
  createdAt: string;
  name: string;
  profilePicture?: string;
  likesNum: number;
  commentsNum: number;
  blurhashString?: string;
  isPostLikedByCurrentUser: number;
  isPostSavedByCurrentUser: number;
};

function Post({ post }: { post: PostType }) {
  const [commentsAreVisible, setCommentsAreVisible] = useState(false);
  const { currentUser } = useAuth();
  const postBelongsToCurrentUser = post.userId === currentUser?.id;
  const navigate = useNavigate();
  const [parent] = useAutoAnimate();
  const { mutate: deletePost, isDeletingPost } = useDeletePost();
  const { mutate: deletePostFromSaved, isPostDeletingFromSaved } =
    useDeleteSavedPost();
  const { mutate: addPostToSaved, isPostAddingToSaved } = useAddSavedPost();

  const hash = window.location.hash;
  const shouldHighlightPost = hash.substring(1) === `post-id-${post.id}`;

  const handleCopyPostAddress = () => {
    const postAddress = `${window.location.protocol}//${window.location.host}/profile/${post.userId}#post-id-${post.id}`;
    window.navigator.clipboard.writeText(postAddress);
    Swal.fire({
      title: "Post address copied to clipboard",
      toast: true,
      showConfirmButton: false,
      position: "top-right",
      timer: 2000,
      icon: "success",
      background: document.documentElement.classList.contains("dark")
        ? "#20232a"
        : undefined,
      color: document.documentElement.classList.contains("dark")
        ? "#dedede"
        : undefined,
    });
  };

  const handleDeletePost = async () => {
    if (postBelongsToCurrentUser || currentUser?.role === "admin") {
      deletePost(post.id, {
        onError: (err) => {
          if (
            err instanceof AxiosError &&
            err.response?.data?.message === "jwt_error"
          ) {
            forceUserToLogIn(navigate);
          } else {
            Swal.fire({
              title:
                err instanceof AxiosError
                  ? err.response?.data?.message
                  : getErrorMessage(err),
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              icon: "error",
              background: document.documentElement.classList.contains("dark")
                ? "#20232a"
                : undefined,
            });
          }
        },
        onSuccess: () => {
          Swal.fire({
            title: "Post deleted",
            toast: true,
            showConfirmButton: false,
            position: "top-right",
            timer: 2000,
            icon: "success",
          });
        },
      });
    }
  };

  const handleAddPostToSaved = (post: PostType) => {
    addPostToSaved(post.id, {
      onError: () => {
        Swal.fire({
          title: "Failed to add post to saved",
          toast: true,
          showConfirmButton: false,
          position: "top-right",
          timer: 2000,
          icon: "error",
        });
      },
    });
  };

  const handleDeletePostFromSaved = (post: PostType) => {
    deletePostFromSaved(post.id, {
      onError: () => {
        Swal.fire({
          title: "Failed to remove post from saved",
          toast: true,
          showConfirmButton: false,
          position: "top-right",
          timer: 2000,
          icon: "error",
        });
      },
    });
  };

  return (
    <article
      id={`post-id-${post.id}`}
      ref={parent}
      className={cn(
        "bg-white dark:bg-[#20232a] rounded-lg pt-5 pb-3 px-3 sm:px-7 dark:text-gray-300",
        shouldHighlightPost ? "scale_animation" : null
      )}>
      {/* User */}
      <header className="flex justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.userId}`}
            className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full">
            <img
              src={post.profilePicture || defaultProfilePic}
              alt="Author"
              className="bg-gray-100 dark:bg-gray-500"
            />
          </Link>

          <div className="flex flex-col">
            <Link
              to={`/profile/${post.userId}`}
              className="font-semibold text-neutral-900 dark:text-inherit hover:underline underline-offset-2">
              {post.name}
            </Link>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {" "}
              {intlFormatDistance(post.createdAt, new Date())}
            </span>
          </div>
        </div>

        {/* More actions tooltip */}
        <div className="flex items-center justify-center gap-2 group overflow-hidden">
          <button
            onClick={handleDeletePost}
            disabled={
              (!postBelongsToCurrentUser || isDeletingPost) &&
              !(currentUser?.role === "admin")
            }
            id="deleteBtn"
            className={cn(
              "translate-x-32 group-has-[:checked]:translate-x-0 transition-transform duration-300 text-white h-7 w-16 px-2 py-[1px] rounded drop-shadow-sm",
              postBelongsToCurrentUser || currentUser?.role === "admin"
                ? "bg-red-400 hover:bg-red-500 hover:drop-shadow"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-400 text-white cursor-not-allowed"
            )}>
            {isDeletingPost ? (
              <SpinnerCircle iconClassName="size-5 text-red-400 fill-white drop-shadow-none" />
            ) : (
              "Delete"
            )}
          </button>
          <label
            htmlFor={String(post.id)}
            className="hover:scale-110 cursor-pointer">
            <input
              className="hidden"
              id={String(post.id)}
              aria-label="More post actions"
              type="checkbox"
            />
            <IoIosMore className="w-5 h-5 drop-shadow" />
          </label>
        </div>
      </header>

      {/* Post  */}
      <div className="flex flex-col gap-2 my-3">
        {post.image && (
          <div
            className="flex items-center justify-center hover:cursor-pointer"
            onClick={() => {
              Swal.fire({
                imageUrl: post.image,
                showConfirmButton: false,
                width: "clamp(70%,800px,95%)",
                animation: false,
                showCloseButton: true,
                focusCancel: false,
                scrollbarPadding: false,
                background: document.documentElement.classList.contains("dark")
                  ? "#20232a"
                  : undefined,
              });
            }}>
            <ImageWithBlurhash
              height="30rem"
              type="post"
              key={post.id}
              imageSrc={post.image}
              owner={post.name}
              blurhash={post.blurhashString}
              imgClassName="max-h-[30rem]"
            />
          </div>
        )}
        <p className="px-1 overflow-x-auto">{post.textContent}</p>
      </div>

      {/* Comments */}
      {commentsAreVisible && (
        <aside>
          <Comments postId={post.id} />
        </aside>
      )}

      {/* like, comment, save*/}
      <div className="flex items-center justify-between mt-2">
        <div>
          <LikePostButton
            postId={post.id}
            likesNum={post.likesNum}
            isPostLikedByCurrentUser={post.isPostLikedByCurrentUser === 1}
          />
        </div>
        <div className="flex items-center gap-6 text-slate-700 dark:text-gray-400">
          <button
            aria-label="Copy post address"
            onClick={handleCopyPostAddress}
            className="hover:text-black dark:hover:text-gray-200">
            <FaRegShareFromSquare className="size-5 scale-110" />
          </button>
          <button
            disabled={isPostAddingToSaved || isPostDeletingFromSaved}
            className="hover:text-black dark:hover:text-gray-200"
            aria-label="Bookmark post">
            {post.isPostSavedByCurrentUser === 0 ? (
              <FaRegBookmark
                className={cn(
                  "scale-125",
                  isPostAddingToSaved || isPostDeletingFromSaved
                    ? "animate-pulse text-yellow-700"
                    : null
                )}
                onClick={() => handleAddPostToSaved(post)}
              />
            ) : (
              <FaBookmark
                className={cn(
                  "scale-125 text-yellow-600 dark:text-yellow-700 hover:text-opacity-85",
                  isPostAddingToSaved || isPostDeletingFromSaved
                    ? "animate-pulse"
                    : null
                )}
                onClick={() => handleDeletePostFromSaved(post)}
              />
            )}
          </button>
          <button
            aria-label="Show comments"
            onClick={() => {
              setCommentsAreVisible((bool) => !bool);
            }}
            className="hover:text-black dark:hover:text-gray-200 relative">
            <FaRegCommentDots className="scale-[135%]" />
            {post.commentsNum ? (
              <div className="absolute bg-red-400 rounded-full -right-1 -top-1">
                <div className="size-[12px] relative">
                  <span className="text-[11px] absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 text-white">
                    {post.commentsNum}
                  </span>
                </div>
              </div>
            ) : null}
          </button>
        </div>
      </div>
    </article>
  );
}

export default Post;
