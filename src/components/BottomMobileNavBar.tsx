import { GrHomeRounded } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { RiSettings4Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import defaultUserImage from "../assets/default-user.jpg";
import { CgMoreO } from "react-icons/cg";
import { useState } from "react";
import { cn } from "../utils/cn";
import { FaBookBookmark } from "react-icons/fa6";
import { FaHistory, FaUserFriends } from "react-icons/fa";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { IoMdPersonAdd } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";

function BottomMobileNavBar() {
  const { currentUser } = useAuth();
  const [showMoreActions, setShowMoreActions] = useState(false);

  const queryClient = useQueryClient();
  const suggestedFriends = queryClient.getQueryData(["suggested-users"]);

  const ref = useOutsideClick(() => {
    setShowMoreActions(false);
  });

  return (
    <div
      className={cn(
        "fixed w-full -bottom-0.5 sm:hidden bg-gray-50 dark:bg-[#282C34] drop-shadow dark:text-gray-300 text-neutral-800 z-10"
      )}>
      <div
        className={cn(
          "grid grid-cols-2 grid-rows-2 h-[120px] gap-x-2 min-[390px]:gap-x-6 gap-y-2 min-[390px]:px-6 px-2 py-2 bg-inherit w-full grow-from-bottom-inactive",
          showMoreActions ? "grow-from-bottom-active" : null
        )}>
        <Link
          to={"/my-stories"}
          className="flex items-center gap-3 rounded drop-shadow-sm bg-white dark:bg-[#20232a] px-3 py-1">
          <FaHistory className="size-6 scale-95" />
          My stories
        </Link>
        <Link
          to={"/saved-posts"}
          className="flex items-center gap-3 rounded drop-shadow-sm bg-white dark:bg-[#20232a] px-3 py-1">
          <FaBookBookmark className="size-6 scale-95" />
          Saved
        </Link>
        <Link
          to={"/my-friends"}
          className="flex items-center gap-3 rounded drop-shadow-sm bg-white dark:bg-[#20232a] px-3 py-1">
          <FaUserFriends className="size-6 scale-95" />
          Friends
        </Link>
        <Link
          to={"/suggested-users"}
          className="relative overflow-hidden flex items-center gap-3 rounded drop-shadow-sm bg-white dark:bg-[#20232a] px-3 py-1">
          <IoMdPersonAdd className="size-6 scale-95" />
          Make a friend
          <div
            className={cn(
              "inset-0 absolute",
              showMoreActions &&
                Array.isArray(suggestedFriends) &&
                suggestedFriends.length > 0
                ? "bg-gradient-to-r from-transparent via-violet-300/30 to-transparent skeleton_animation"
                : null
            )}></div>
        </Link>
      </div>

      <div className="flex justify-around items-center h-[56px]">
        <Link to={"/"} className="">
          <GrHomeRounded className="h-7 w-7" />
        </Link>
        <Link to={"/search"}>
          <HiMiniMagnifyingGlass className="h-9 w-9" />
        </Link>
        <div ref={ref}>
          <button onClick={() => setShowMoreActions((bool) => !bool)}>
            <CgMoreO className="h-10 w-10" />
          </button>
        </div>
        <Link to={"/profile/update-profile"}>
          <RiSettings4Line className="h-9 w-9" />
        </Link>
        <Link to={`/profile/${currentUser?.id}`}>
          <img
            src={currentUser?.profilePicture || defaultUserImage}
            alt="User"
            className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}

export default BottomMobileNavBar;
