import { Link, useNavigate } from "react-router-dom";
import { toggleDarkMode } from "../utils/toggleDarkMode";
import SocialSpectreLogoSmall from "../assets/SocialSpectrumLogoSmall.png";
import defaultUserImage from "../assets/default-user.jpg";
import { useAuth } from "../context/authContext";
import { GiMoon } from "react-icons/gi";
import {
  MdKeyboardArrowDown,
  MdOutlineLogout,
  MdOutlineWbSunny,
} from "react-icons/md";
import { useState } from "react";
import { cn } from "../utils/cn";
import Search from "./Search";
import { forceUserToLogIn } from "../hooks/useHandleJwtExpiration";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useChangeUserVisibility } from "../hooks/reactQueryHooks/users/useChangeUserVisibility";
import { FaRegCheckSquare } from "react-icons/fa";
import Swal from "sweetalert2";

function TopNavBar() {
  const { currentUser, refreshUserData } = useAuth();

  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("theme")
  );

  const navigate = useNavigate();

  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const statusSelectorRef = useOutsideClick(() => {
    setShowStatusSelector(false);
  });
  const { mutate: changeUserVisibility, isChangingUserVisibility } =
    useChangeUserVisibility();

  const handleClickChangeVisibility = (
    userId: string,
    newVisibility: "online" | "invisible"
  ) => {
    setShowStatusSelector(false);
    if (currentUser?.visibility === newVisibility) return null;
    changeUserVisibility(
      {
        userId: userId,
        visibility: newVisibility,
      },
      {
        onSuccess: () => {
          if (!currentUser?.id) return forceUserToLogIn(navigate);
          refreshUserData(String(currentUser?.id));
        },
        onError: () => {
          Swal.fire({
            title: "Cannot change visibility at this moment",
            toast: true,
            showConfirmButton: false,
            position: "top-right",
            timer: 2000,
            icon: "error",
            background: document.documentElement.classList.contains("dark")
              ? "#20232a"
              : undefined,
            color: document.documentElement.classList.contains("dark")
              ? "#dedede"
              : undefined,
          });
        },
      }
    );
  };

  return (
    <header className="flex justify-between items-center h-12 border-b border-gray-400/20 drop-shadow-sm dark:drop-shadow dark:border-0 px-3 backdrop-blur-lg bg-white/70 dark:bg-[#282C34]/80 static sm:sticky top-0 z-10">
      {/* Left part */}
      <div className="flex shrink-0 gap-4 items-center">
        <Link to="/" className="flex flex-nowrap items-center">
          <img src={SocialSpectreLogoSmall} className="h-12 w-12" alt="" />
          <span className="inline sm:hidden md:inline font-bold text-neutral-900 dark:text-gray-300">
            SocialSpectrum
          </span>
        </Link>

        <button
          className="relative size-5 overflow-hidden"
          onClick={() => {
            setTheme(toggleDarkMode());
          }}
          aria-label="Toggle dark mode">
          <div
            className={cn(
              "flex transition-all",
              theme === "dark" ? "-translate-x-5" : null
            )}>
            <GiMoon className="dark:text-gray-300 min-h-5 min-w-5 text-blue-950" />
            <MdOutlineWbSunny className="min-h-5 min-w-5 text-neutral-800 dark:text-yellow-400" />
          </div>
        </button>
      </div>

      {/* Right part */}
      <div className="flex flex-nowrap items-center gap-3">
        <Search fullPageMode={false} />

        <Link
          to={`/profile/${currentUser?.id}`}
          className="hidden sm:flex flex-nowrap gap-2 items-center">
          <div className="relative">
            <img
              src={currentUser?.profilePicture || defaultUserImage}
              alt="User"
              className="h-6 w-6 rounded-full object-cover"
            />
            <div
              className={cn(
                "absolute h-2 w-2 rounded-full top-0 right-0",
                currentUser?.visibility === "online"
                  ? "bg-green-500"
                  : "bg-gray-400",
                isChangingUserVisibility ? "animate-pulse" : null
              )}
            />
          </div>
          <span className="text-nowrap overflow-hidden overflow-ellipsis max-w-36 pr-2 dark:text-gray-300">
            {currentUser?.name}
          </span>
        </Link>

        <div
          ref={statusSelectorRef}
          className="-ml-3 mr-2 relative cursor-pointer z-50">
          <div className="flex w-fit items-center">
            <div
              className={cn(
                "size-3 rounded-full sm:hidden",
                currentUser?.visibility === "online"
                  ? "bg-green-500"
                  : "bg-gray-400"
              )}></div>
            <button onClick={() => setShowStatusSelector((bool) => !bool)}>
              <MdKeyboardArrowDown className="size-6 top-0 hover:translate-y-[1px] transition-transform dark:text-gray-300" />
            </button>
          </div>

          {showStatusSelector && (
            <div className="w-32 flex flex-col gap-0.5 absolute top-6 -left-20 bg-slate-100 dark:bg-slate-700/80 dark:text-gray-200 rounded px-1 py-1 drop-shadow-sm">
              <button
                onClick={() => {
                  handleClickChangeVisibility(`${currentUser?.id}`, "online");
                }}
                className={cn(
                  "flex justify-between items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 w-full rounded pl-2",
                  currentUser?.visibility === "online"
                    ? "bg-slate-200/50 dark:bg-slate-700"
                    : null
                )}>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-green-500"></div>
                  <span>Online</span>
                </div>
                {currentUser?.visibility === "online" && <FaRegCheckSquare />}
              </button>
              <button
                onClick={() =>
                  handleClickChangeVisibility(`${currentUser?.id}`, "invisible")
                }
                className={cn(
                  "flex justify-between items-center hover:bg-slate-200 dark:hover:bg-slate-600 w-full rounded pl-2",
                  currentUser?.visibility === "invisible"
                    ? "bg-slate-200/50 dark:bg-slate-700"
                    : null
                )}>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-gray-400"></div>
                  <span>Invisible</span>
                </div>
                {currentUser?.visibility === "invisible" && (
                  <FaRegCheckSquare className="size-4 mr-1" />
                )}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => forceUserToLogIn(navigate, "Logged out", "success")}>
          <MdOutlineLogout className="dark:text-gray-300 size-[22px] text-neutral-700 -ml-2 hover:text-neutral-500" />
        </button>
      </div>
    </header>
  );
}

export default TopNavBar;
