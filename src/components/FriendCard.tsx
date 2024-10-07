import { FollowedUserType } from "../services/apiRelationships";
import defaultProfilePicture from "../assets/default-user.jpg";
import { RiUserUnfollowLine } from "react-icons/ri";
import { useUnfollowUser } from "../hooks/reactQueryHooks/relationships/useUnfollowUser";
import SpinnerCircle from "./SpinnerCircle";
import { Link } from "react-router-dom";

type FriendCardProps = {
  user: FollowedUserType;
};

function FriendCard({ user }: FriendCardProps) {
  const { mutate: unfollow, isLoadingUnfollowUser } = useUnfollowUser();

  const handleClickUnfollow = (id: number) => {
    unfollow(String(id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-center justify-between px-3 md:px-8 py-8 rounded-lg dark:bg-[#23262D] bg-[#F8F8FA] shadow">
      <div className="flex gap-4 self-start">
        <Link className="flex items-center relative" to={`/profile/${user.id}`}>
          <img
            draggable={false}
            src={user?.profilePicture || defaultProfilePicture}
            alt="User"
            className="size-24 min-w-24 object-cover rounded-lg"
          />
          {user.visibility === "online" && (
            <div className="size-4 bg-green-500 absolute right-0 bottom-0 rounded-full"></div>
          )}
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${user.id}`}
            className="font-semibold text-lg hover:underline h-fit">
            {user.name}
          </Link>
          <span className="text-gray-600 dark:text-gray-400 italic pr-4 xl:pr-12 max-h-56 max-w-52 min-[420px]:max-w-full overflow-clip overflow-ellipsis">
            {user.statusText}
          </span>
        </div>
      </div>

      <button
        disabled={isLoadingUnfollowUser}
        onClick={() => handleClickUnfollow(user.id)}
        className="w-32 flex justify-center items-center self-center lg:self-auto mr-4 lg:mr-0 gap-2 border px-4 py-2 rounded-full hover:outline hover:outline-2 hover:-outline-offset-2 dark:bg-gray-800">
        {isLoadingUnfollowUser ? (
          <SpinnerCircle iconClassName="size-5 fill-gray-500" />
        ) : (
          <RiUserUnfollowLine className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        )}
        <span className="font-semibold">Unfollow</span>
      </button>
    </div>
  );
}

export default FriendCard;
