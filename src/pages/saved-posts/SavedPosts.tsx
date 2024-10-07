import Post from "../../components/Post";
import SpinnerCircle from "../../components/SpinnerCircle";
import { useGetSavedPosts } from "../../hooks/reactQueryHooks/posts/useGetSavedPosts";
import { useHandleJwtExpiration } from "../../hooks/useHandleJwtExpiration";

function SavedPosts() {
  const { savedPosts, isLoading: areLoadingPosts, error } = useGetSavedPosts();

  useHandleJwtExpiration(error);

  return (
    <div className="pb-14 min-h-screen">
      {error ? (
        <div className="flex items-center justify-center mt-10 gap-2 flex-col">
          <span>Something went wrong</span>
          <span>{error?.message}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5 sm:gap-7 my-3 drop-shadow-sm max-w-7xl mx-auto">
          {areLoadingPosts ? (
            <SpinnerCircle
              containerClassName="animate-pulse mt-56"
              iconClassName="fill-black size-16 dark:text-gray-500"
            />
          ) : Array.isArray(savedPosts) && savedPosts.length === 0 ? (
            <div className="flex justify-center mt-36 text-gray-500">
              No saved posts here
            </div>
          ) : (
            <>
              {Array.isArray(savedPosts) &&
                savedPosts.length > 0 &&
                savedPosts.map((post) => <Post post={post} key={post.id} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SavedPosts;
