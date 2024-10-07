import { Link } from "react-router-dom";
import defaultUserImage from "../assets/default-user.jpg";
import SpinnerCircle from "./SpinnerCircle";
import { useGetFriendsOnline } from "../hooks/reactQueryHooks/users/useGetFriendsOnline";
import { cn } from "../utils/cn";
import SuggestedUsers from "./SuggestedUsers";

function RightSideBar({
  className,
  narrowVersion = false,
}: {
  className?: string;
  narrowVersion?: boolean;
}) {
  const {
    friendsOnline,
    isFetching: isFetchingOnlineUsers,
    error: onlineUsersError,
  } = useGetFriendsOnline();

  return (
    <aside
      className={cn(
        "overflow-y-auto scrollbar-hide text-gray-950 bg-inherit dark:text-gray-300",
        className
      )}>
      {/* SUGGESTED USERS */}
      <SuggestedUsers narrowVersion={narrowVersion} />

      {/* Online friends */}
      <div
        className={cn(
          "flex flex-col max-h-96 overflow-y-auto gap-3 bg-white my-4 drop-shadow-sm rounded p-3 dark:bg-[#20232a]",
          narrowVersion ? "px-1.5" : null
        )}>
        <span className="text-sm text-gray-500">Online friends</span>

        {isFetchingOnlineUsers ? (
          <SpinnerCircle containerClassName="h-28" />
        ) : onlineUsersError ? (
          <span className="text-xs text-center">
            Cannot load friends online
          </span>
        ) : Array.isArray(friendsOnline) && friendsOnline.length === 0 ? (
          <span className="text-center text-sm text-gray-500 mb-3">
            {"Currently no friends online"}
          </span>
        ) : (
          friendsOnline &&
          Array.isArray(friendsOnline) &&
          friendsOnline.length > 0 &&
          friendsOnline.map((userOnline) => (
            <Link
              to={`/profile/${userOnline.id}`}
              key={userOnline.id}
              className="flex flex-nowrap items-center gap-2 mt-1">
              <div className="relative">
                <div className="absolute bg-green-500 h-2 w-2 rounded-full top-0 right-0" />
                <img
                  src={userOnline.profilePicture || defaultUserImage}
                  alt="User"
                  className="h-5 w-5 min-w-5 rounded-full object-cover"
                />
              </div>
              <span className="text-nowrap overflow-hidden overflow-ellipsis max-w-fit">
                {userOnline.name}
              </span>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}

export default RightSideBar;
