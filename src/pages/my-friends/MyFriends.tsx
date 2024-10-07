import { useState } from "react";
import FriendCard from "../../components/FriendCard";
import SpinnerCircle from "../../components/SpinnerCircle";
import { useGetWhoIsUserFollowing } from "../../hooks/reactQueryHooks/relationships/useGetWhoIsUserFollowing";
import { useHandleJwtExpiration } from "../../hooks/useHandleJwtExpiration";
import { cn } from "../../utils/cn";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function MyFriends() {
  const [showOnlyOnlineUsers, setShowOnlyOnlineUsers] =
    useState<boolean>(false);
  const { error, followedUsers, isFetching } = useGetWhoIsUserFollowing();
  const [parent] = useAutoAnimate();

  useHandleJwtExpiration(error);

  return (
    <div
      className={cn(
        "flex flex-col items-center mt-4 mb-6 py-10 px-2 md:px-6 lg:px-16 bg-white dark:bg-[#20232a] text-gray-900 dark:text-gray-200 rounded-md overflow-hidden drop-shadow-sm min-h-[90%] max-w-7xl mx-auto",
        Array.isArray(followedUsers) && followedUsers.length
          ? "min-h-fit"
          : null
      )}>
      <span className="text-3xl mb-8">People you follow:</span>
      {Array.isArray(followedUsers) && followedUsers?.length > 0 && (
        <button
          onClick={() => {
            setShowOnlyOnlineUsers((show) => !show);
          }}
          className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 dark:text-gray-300 hover:opacity-80 rounded px-2 py-1 self-start mb-2 text-sm text-gray-600">
          {showOnlyOnlineUsers ? (
            <MdOutlineRadioButtonChecked />
          ) : (
            <MdOutlineRadioButtonUnchecked />
          )}
          Hide offline users
        </button>
      )}
      {isFetching ? (
        <SpinnerCircle iconClassName="fill-indigo-300 dark:text-gray-400" />
      ) : error ? (
        <div>
          {getErrorMessage(error) || "Some error occurs during users loading"}
        </div>
      ) : (
        <>
          {Array.isArray(followedUsers) && followedUsers?.length === 0 ? (
            <div className="my-28">{"You don't follow anyone"}</div>
          ) : Array.isArray(followedUsers) &&
            followedUsers.filter((user) => user.visibility === "online")
              .length === 0 &&
            showOnlyOnlineUsers ? (
            <div className="my-12 text-gray-400">
              All friends are offline at the moment
            </div>
          ) : (
            <div
              ref={parent}
              className="flex flex-col  gap-6 dark:divide-gray-700 w-full">
              {(
                (Array.isArray(followedUsers) && showOnlyOnlineUsers
                  ? followedUsers.filter((user) => user.visibility === "online")
                  : followedUsers) ?? []
              ).map((user) => (
                <FriendCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyFriends;
