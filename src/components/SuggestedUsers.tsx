import { Link } from "react-router-dom";
import { useFollowUser } from "../hooks/reactQueryHooks/relationships/useFollowUser";
import { useGetSuggestedUsers } from "../hooks/reactQueryHooks/users/useGetSuggestedUsers";
import SpinnerCircle from "./SpinnerCircle";
import defaultUserImage from "../assets/default-user.jpg";
import { cn } from "../utils/cn";
import { SlUserFollow } from "react-icons/sl";
import { useState } from "react";

function SuggestedUsers({
  narrowVersion = false,
  tallVersion = false,
}: {
  narrowVersion?: boolean;
  tallVersion?: boolean;
}) {
  const {
    suggestedUsers,
    isFetching: isFetchingSuggested,
    error: suggestedUsersError,
  } = useGetSuggestedUsers();

  const { mutate: follow, isLoadingFollowUser } = useFollowUser();
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

  const handleFollowUser = function (id: number) {
    setLoadingUserId(id);
    follow(id, {
      onSettled: () => setLoadingUserId(null),
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 bg-white dark:bg-[#20232a] my-4 drop-shadow-sm rounded p-3",
        narrowVersion ? "px-1.5" : null,
        tallVersion ? "gap-8 pb-10" : null
      )}>
      <span
        className={cn(
          "text-sm text-gray-500",
          tallVersion
            ? "text-lg text-center font-semibold text-gray-900 dark:text-gray-100 mt-6"
            : null
        )}>
        Suggestions for you
      </span>
      {isFetchingSuggested ? (
        <SpinnerCircle containerClassName="h-28" />
      ) : suggestedUsersError ? (
        <span
          className={cn(
            "text-xs text-center",
            tallVersion ? "text-base dark: text-gray-400 mb-7" : null
          )}>
          Cannot load suggested users
        </span>
      ) : Array.isArray(suggestedUsers) && suggestedUsers.length === 0 ? (
        <span className="text-center text-sm text-gray-500 mb-3">
          {"Currently no users to suggest"}
        </span>
      ) : (
        suggestedUsers &&
        Array.isArray(suggestedUsers) &&
        suggestedUsers.length > 0 &&
        suggestedUsers.map((user) => (
          <div
            key={user.id}
            className={"flex flex-nowrap items-center justify-between"}>
            <Link
              to={`/profile/${user.id}`}
              className="flex flex-nowrap items-center gap-2 mt-1">
              <img
                src={user.profilePicture || defaultUserImage}
                alt="User"
                className={cn(
                  "h-5 w-5 rounded-full object-cover",
                  tallVersion ? "size-12 rounded-md" : null
                )}
              />
              <span
                className={cn(
                  "text-nowrap overflow-hidden overflow-ellipsis",
                  narrowVersion ? "max-w-28" : "max-w-40",
                  tallVersion
                    ? "px-2 text-lg max-w-60 dark:text-gray-200"
                    : null
                )}>
                {user.name}
              </span>
            </Link>

            <button
              disabled={isLoadingFollowUser}
              onClick={() => handleFollowUser(user.id)}
              className={cn(
                "px-2 py-[2px] h-5 bg-indigo-300 hover:bg-indigo-400 rounded text-xs dark:text-neutral-700 shadow hover:shadow-md",
                narrowVersion ? "w-fit" : "w-14",
                tallVersion ? "h-8 px-3 text-sm w-16" : null
              )}>
              {loadingUserId === user.id ? (
                <SpinnerCircle containerClassName="size-3 mx-auto" />
              ) : (
                <>{narrowVersion ? <SlUserFollow /> : "Follow"}</>
              )}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SuggestedUsers;
