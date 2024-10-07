import { cn } from "../../utils/cn";
import { BsGeoAlt } from "react-icons/bs";
import {
  IoEllipsisVerticalCircleOutline,
  IoLanguageOutline,
} from "react-icons/io5";
import { HiOutlineUserAdd } from "react-icons/hi";
import { RiUserSettingsFill } from "react-icons/ri";
import { FaQuoteLeft, FaQuoteRight, FaRegCircleCheck } from "react-icons/fa6";
import Posts from "../../components/Posts";
import { useFindUser } from "../../hooks/reactQueryHooks/users/useFindUser";
import { Link, useNavigate, useParams } from "react-router-dom";
import SpinnerCircle from "../../components/SpinnerCircle";
import DefaultProfileBg from "../../assets/profile-default-bg-pic.jpg";
import DefaultUserImage from "../../assets/default-user.jpg";
import {
  forceUserToLogIn,
  useHandleJwtExpiration,
} from "../../hooks/useHandleJwtExpiration";
import { useAuth } from "../../context/authContext";
import { useGetUserFollowers } from "../../hooks/reactQueryHooks/relationships/useGetUserFollowers";
import { useFollowUser } from "../../hooks/reactQueryHooks/relationships/useFollowUser";
import { useUnfollowUser } from "../../hooks/reactQueryHooks/relationships/useUnfollowUser";
import { VscError } from "react-icons/vsc";
import Swal from "sweetalert2";
import { useState } from "react";
import { useDeleteUserAccount } from "../../hooks/reactQueryHooks/users/useDeleteUserAccount";
import { AxiosError } from "axios";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useOutsideClick } from "../../hooks/useOutsideClick";

function Profile() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { user, isPending: isLoadingUserData, error } = useFindUser(id || "");
  const isUserOnOwnPage = currentUser?.id === parseInt(id || "");
  const [showDeleteAccountBtn, setShowDeleteAccountBtn] = useState(false);

  const ref = useOutsideClick(() => setShowDeleteAccountBtn(false));

  const navigate = useNavigate();

  const {
    followers,
    isFetching: isLoadingFollowersList,
    error: followersError,
  } = useGetUserFollowers(id);

  const isCurrentUserFollowingThePerson =
    !isLoadingFollowersList &&
    !followersError &&
    Array.isArray(followers) &&
    followers.includes(currentUser?.id);

  const { mutate: follow, isLoadingFollowUser } = useFollowUser();
  const { mutate: unfollow, isLoadingUnfollowUser } = useUnfollowUser();
  const { mutate: deleteAccount } = useDeleteUserAccount();

  const handleClickFollowButton = (id: string) => {
    if (
      isLoadingFollowUser ||
      isLoadingUnfollowUser ||
      isLoadingFollowersList
    ) {
      return;
    }
    isCurrentUserFollowingThePerson ? unfollow(id) : follow(id);
  };

  const handleDeleteUserAccount = (id: number) => {
    deleteAccount(id, {
      onSuccess: () => {
        currentUser?.role === "admin"
          ? navigate("/")
          : forceUserToLogIn(navigate);
      },
      onError: (err) => {
        Swal.fire({
          iconColor: "gray",
          title:
            err instanceof AxiosError
              ? err.response?.data?.message
              : getErrorMessage(err),
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          icon: "error",
          scrollbarPadding: false,
          background: document.documentElement.classList.contains("dark")
            ? "#20232a"
            : undefined,
        });
      },
    });
  };

  useHandleJwtExpiration(error);

  if (isLoadingUserData) {
    return (
      <SpinnerCircle iconClassName="fill-black size-16 mt-32 dark:text-gray-500" />
    );
  } else if (!id || error || !Array.isArray(user) || !user.length) {
    return (
      <div className="flex flex-col items-center justify-evenly h-96 mt-4 bg-white dark:bg-[#20232a] rounded-md overflow-hidden drop-shadow-sm">
        <VscError className="text-red-600/20 size-40" />
        <span className="text-gray-900 dark:text-gray-200 text-2xl">
          Something went wrong 🥹
          <br />
          Make sure this user exists
        </span>
        <Link
          to={"/"}
          className="text-2xl bg-gray-200 dark:bg-gray-400 hover:bg-gray-300 rounded px-4 py-1">
          Home
        </Link>
      </div>
    );
  } else {
    return (
      <>
        <div className="mt-4 mb-6 bg-white dark:bg-[#20232a] text-gray-900 dark:text-gray-200 rounded-md overflow-hidden drop-shadow-sm">
          <div
            className={cn(
              "relative h-72",
              user?.[0].statusText ? "h-[340px]" : ""
            )}>
            {(isUserOnOwnPage || currentUser?.role === "admin") && (
              <div ref={ref}>
                <button
                  onClick={() => {
                    setShowDeleteAccountBtn((bool) => !bool);
                  }}
                  aria-label="More actions on profile"
                  className="absolute right-3 top-2 drop-shadow-md shadow-xl rounded-full">
                  <IoEllipsisVerticalCircleOutline className="h-8 w-8 text-gray-800 hover:scale-110" />
                  <div className="relative">
                    {showDeleteAccountBtn && (
                      <button
                        onClick={() => {
                          Swal.fire({
                            title:
                              "Do you want to delete the account? This action cannot be undone.",
                            showCancelButton: true,
                            confirmButtonText: "Yes, Delete Account",
                            confirmButtonColor: "red",
                            scrollbarPadding: false,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleDeleteUserAccount(parseInt(id));
                            }
                          });
                        }}
                        className="absolute right-10 -top-8 bg-gray-50 dark:bg-gray-200 text-red-900 hover:bg-opacity-95 py-1 px-2 rounded text-nowrap">
                        Delete account
                      </button>
                    )}
                  </div>
                </button>
              </div>
            )}

            <img
              draggable="false"
              className="w-full h-60 object-cover"
              src={user[0].bgPicture || DefaultProfileBg}
              alt=""
            />

            <div
              className={cn(
                "absolute z-10 top-20 xl:left-6 left-1/2 xl:translate-x-0 -translate-x-1/2 rounded-full shadow",
                "bg-gray-50 drop-shadow-sm h-[200px] w-[200px]"
              )}>
              <img
                onClick={() => {
                  Swal.fire({
                    imageUrl: user[0].profilePicture || DefaultUserImage,
                    showConfirmButton: false,
                    width: "clamp(70%,800px,95%)",
                    animation: false,
                    showCloseButton: true,
                    focusCancel: false,
                    scrollbarPadding: false,
                    background: document.documentElement.classList.contains(
                      "dark"
                    )
                      ? "#20232a"
                      : undefined,
                  });
                }}
                draggable="false"
                className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute rounded-full h-48 w-48 object-cover shadow-lg hover:cursor-pointer"
                src={user[0].profilePicture || DefaultUserImage}
                alt="User"
              />
            </div>

            {user?.[0].statusText ? (
              <div className="flex">
                <div className="flex mt-12 xl:mt-5 mx-auto xl:ml-60 w-fit px-3 pt-4">
                  <FaQuoteLeft className="size-4 text-gray-800 dark:text-inherit -translate-y-4" />
                  <blockquote className="px-4 italic text-center drop-shadow">
                    {user?.[0].statusText}
                  </blockquote>
                  <FaQuoteRight className="size-4 text-gray-800 dark:text-inherit translate-y-4" />
                </div>
              </div>
            ) : null}
          </div>

          <header
            className={cn(
              "xl:p-7 p-4 flex gap-3 xl:gap-0 flex-col xl:flex-row justify-between text-sm",
              user?.[0].statusText ? "xl:px-7 pb-7 !pt-2" : ""
            )}>
            <div className="flex flex-col xl:flex-row gap-3 xl:gap-10 items-center">
              <h2 className="font-bold text-2xl xl:text-3xl text-nowrap mt-7 xl:mt-0 max-w-72 overflow-hidden overflow-ellipsis">
                {user[0].name}
              </h2>
              <div className="flex gap-2">
                {isUserOnOwnPage ? (
                  <Link
                    to={"/profile/update-profile"}
                    className="w-fit flex justify-center gap-2 border px-4 py-2 rounded-full hover:outline hover:outline-2 hover:-outline-offset-2">
                    <RiUserSettingsFill className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                    <span className="font-semibold text-nowrap">
                      Update profile
                    </span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleClickFollowButton(user[0]?.id)}
                      disabled={isLoadingFollowUser && isLoadingUnfollowUser}
                      className={cn(
                        "w-32 flex justify-center gap-2 border px-4 py-2 rounded-full hover:outline hover:outline-2 hover:-outline-offset-2 dark:bg-gray-800",
                        isCurrentUserFollowingThePerson ? "bg-blue-50" : null
                      )}>
                      {isLoadingFollowersList ||
                      isLoadingFollowUser ||
                      isLoadingUnfollowUser ||
                      isLoadingUserData ? (
                        <SpinnerCircle iconClassName="size-5 fill-gray-500" />
                      ) : isCurrentUserFollowingThePerson ? (
                        <FaRegCircleCheck className="h-5 w-5 text-green-900" />
                      ) : (
                        <HiOutlineUserAdd className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                      )}
                      <span className="font-semibold">
                        {isCurrentUserFollowingThePerson
                          ? "Following"
                          : "Follow"}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="ml-4 flex flex-col gap-2 w-48">
              {user[0].country && (
                <div className="flex gap-2 items-center justify-start">
                  <BsGeoAlt className="h-6 w-6" />
                  <span>{user[0].country}</span>
                </div>
              )}
              {user[0].languages && (
                <div className="flex gap-2">
                  <IoLanguageOutline className="h-6 w-6 min-w-6 min-h-6" />
                  <span>{user[0].languages}</span>
                </div>
              )}
            </div>
          </header>
        </div>

        <Posts showOnlyUserPosts={id} />
      </>
    );
  }
}

export default Profile;
