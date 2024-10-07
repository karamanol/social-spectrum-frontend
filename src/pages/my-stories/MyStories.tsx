import { useAuth } from "../../context/authContext";
import { useGetStoriesByUserId } from "../../hooks/reactQueryHooks/stories/useGetStoriesByUserId";
import SpinnerCircle from "../../components/SpinnerCircle";
import { useHandleJwtExpiration } from "../../hooks/useHandleJwtExpiration";
import StoryItemControl from "../../components/StoryItemControl";
import { getErrorMessage } from "../../utils/getErrorMessage";

function MyStories() {
  const { currentUser } = useAuth();
  const { stories, error, isLoading } = useGetStoriesByUserId(
    currentUser?.id || 0
  );

  useHandleJwtExpiration(error);

  return (
    <div className="flex flex-col items-center mt-4 mb-6 py-10 px-6 sm:px-16 bg-white dark:bg-[#20232a] text-gray-900 dark:text-gray-200 rounded-md overflow-hidden drop-shadow-sm min-h-[90%] max-w-7xl mx-auto">
      <span className="text-3xl mb-8">Manage your stories:</span>

      {isLoading ? (
        <SpinnerCircle
          containerClassName="h-64"
          iconClassName="fill-indigo-300"
        />
      ) : error ? (
        <div className="mt-32">
          {getErrorMessage(error) || "Some error occurs during stories loading"}
        </div>
      ) : !stories?.length ? (
        <div className="my-32 text-gray-400">
          {"You have no stories at the moment :("}
        </div>
      ) : (
        <div className="divide-y divide-dashed dark:divide-gray-700 w-full">
          {stories?.map((story) => (
            <StoryItemControl key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyStories;
