import Post from "./Post";
import { useGetPosts } from "../hooks/reactQueryHooks/posts/useGetPosts";
import SpinnerCircle from "./SpinnerCircle";
import { cn } from "../utils/cn";
import { useHandleJwtExpiration } from "../hooks/useHandleJwtExpiration";
import { useEffect } from "react";

function Posts({ showOnlyUserPosts }: { showOnlyUserPosts?: string }) {
  const {
    posts,
    error,
    isLoading: isLoadingPosts,
  } = useGetPosts(showOnlyUserPosts || undefined);

  const hash = window.location.hash;
  useEffect(() => {
    if (hash && Array.isArray(posts) && posts.length) {
      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [hash, posts]);

  useHandleJwtExpiration(error);

  return (
    <div className="pb-14">
      {error ? (
        <div className="flex items-center justify-center mt-10 gap-2 flex-col">
          <span>Something went wrong</span>
          <span>{error?.message}</span>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-5 sm:gap-7 my-3 drop-shadow-sm max-w-7xl mx-auto",
            isLoadingPosts ? "animate-pulse" : ""
          )}>
          {isLoadingPosts ? (
            <SpinnerCircle iconClassName="fill-black size-16 mt-20 dark:text-gray-500" />
          ) : Array.isArray(posts) && posts.length === 0 ? (
            <div className="flex justify-center mt-10 text-gray-500">
              No posts yet
            </div>
          ) : (
            Array.isArray(posts) &&
            posts.length > 0 &&
            posts.map((post) => <Post post={post} key={post.id} />)
          )}
        </div>
      )}
    </div>
  );
}

export default Posts;
