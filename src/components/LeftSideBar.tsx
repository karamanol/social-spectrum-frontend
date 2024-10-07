import { useAuth } from "../context/authContext";
import { Link, useLocation } from "react-router-dom";
import { FaHistory, FaHome, FaRegUser, FaUserFriends } from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import {
  MdOutlineSettingsInputComponent,
  MdPersonSearch,
} from "react-icons/md";
import RightSideBar from "./RightSideBar";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

function LeftSideBar() {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="hidden sm:flex sm:flex-col sm:justify-between border-r border-gray-100 dark:border-0 dark:shadow px-2 h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto scrollbar-hide text-gray-950 bg-white/40 dark:bg-inherit dark:text-gray-300">
      <ul className="flex flex-col gap-1 mt-3">
        <li className="p-1">
          <Link
            to={"/"}
            className={
              "relative flex gap-3 items-center py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full"
            }>
            <FaHome className="size-5 scale-110 text-amber-500 dark:text-amber-600" />
            <span
              className={cn(
                "transition-transform",
                pathname === "/"
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              Home
            </span>
            {pathname === "/" && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>

        <li className="p-1">
          <Link
            to={`/profile/${currentUser?.id}`}
            className="relative flex gap-3 items-center py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full">
            <FaRegUser className="size-5 text-rose-700" />
            <span
              className={cn(
                "transition-transform",
                pathname === `/profile/${currentUser?.id}`
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              Profile
            </span>
            {pathname === `/profile/${currentUser?.id}` && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>

        <li className="p-1">
          <Link
            to={"/my-stories"}
            className="relative flex items-center gap-3 py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full">
            <FaHistory className="size-5 scale-95 text-cyan-800" />
            <span
              className={cn(
                "transition-transform",
                pathname.startsWith("/my-stories")
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              My stories
            </span>
            {pathname.startsWith("/my-stories") && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>

        <li className="p-1">
          <Link
            to={"/my-friends"}
            className="relative flex items-center gap-3 py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full">
            <FaUserFriends className="size-5 scale-95 text-sky-700" />
            <span
              className={cn(
                "transition-transform",
                pathname.startsWith("/my-friends")
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              Friends
            </span>
            {pathname.startsWith("/my-friends") && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>

        <li className="p-1">
          <Link
            to={"/saved-posts"}
            className=" relative flex items-center gap-3 py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full">
            <FaBookBookmark className="size-5 scale-95 text-orange-800 dark:text-orange-900" />
            <span
              className={cn(
                "transition-transform",
                pathname.startsWith("/saved-posts")
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              Saved
            </span>
            {pathname.startsWith("/saved-posts") && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>

        <li className="p-1">
          <Link
            to={"/search"}
            className="relative flex items-center gap-3 py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full">
            <MdPersonSearch className="size-5 scale-125 text-teal-800" />
            <span
              className={cn(
                "transition-transform",
                pathname.startsWith("/search")
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              Search
            </span>
            {pathname.startsWith("/search") && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>

        <li className="p-1">
          <Link
            to={"/profile/update-profile"}
            className="relative flex items-center gap-3 py-1 px-3 hover:bg-gray-200/20 dark:hover:bg-gray-600/5 rounded-full">
            <MdOutlineSettingsInputComponent className="size-5 text-lime-800" />
            <span
              className={cn(
                "transition-transform",
                pathname.startsWith("/profile/update-profile")
                  ? "translate-x-1 font-semibold"
                  : "translate-x-0"
              )}>
              Settings
            </span>
            {pathname.startsWith("/profile/update-profile") && (
              <motion.span
                className="absolute inset-0 bg-gray-400/10 dark:bg-gray-600/10 rounded-full w-full h-full"
                layoutId="activeLink"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}></motion.span>
            )}
          </Link>
        </li>
      </ul>

      <div className="flex xl:hidden">
        <RightSideBar className="w-full" narrowVersion={true} />
      </div>
    </nav>
  );
}

export default LeftSideBar;
