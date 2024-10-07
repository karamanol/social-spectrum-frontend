import Swal from "sweetalert2";
import { useDeleteStory } from "../hooks/reactQueryHooks/stories/useDeleteStory";
import { StoryType } from "./Stories";
import StoryImgWithBlurhash from "./ImageWithBlurhash";
import { AxiosError } from "axios";
import { getErrorMessage } from "../utils/getErrorMessage";
import { CgSandClock } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineEye } from "react-icons/hi";

type StoryItemControlProps = {
  story: StoryType;
};

function StoryItemControl({ story }: StoryItemControlProps) {
  const { isDeletingStory, mutate: deleteStory } = useDeleteStory();

  const handleZoomStory = (story: StoryType) => {
    Swal.fire({
      imageUrl: story.imageUrl,
      showConfirmButton: false,
      width: "clamp(70%,800px,95%)",
      animation: false,
      showCloseButton: true,
      focusCancel: false,
      scrollbarPadding: false,
      background: document.documentElement.classList.contains("dark")
        ? "#20232a"
        : undefined,
    });
  };

  const handleDeleteStory = (storyId: number) => {
    deleteStory(storyId, {
      onError: (err) => {
        Swal.fire({
          title:
            err instanceof AxiosError
              ? err.response?.data?.message
              : getErrorMessage(err) || "Something went wrong",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: "error",
          color: document.documentElement.classList.contains("dark")
            ? "white"
            : undefined,
          background: document.documentElement.classList.contains("dark")
            ? "#20232a"
            : undefined,
        });
      },
      onSuccess: () => {
        Swal.fire({
          position: "top-right",
          color: document.documentElement.classList.contains("dark")
            ? "white"
            : undefined,
          toast: true,
          title: "Story deleted!",
          showConfirmButton: false,
          timer: 1700,
          timerProgressBar: true,
          icon: "success",
          background: document.documentElement.classList.contains("dark")
            ? "#20232a"
            : undefined,
        });
      },
    });
  };

  return (
    <div
      key={story.id}
      className="flex justify-between items-center w-full min-h-28 p-5">
      <div
        className="h-40 w-40 overflow-hidden flex items-stretch justify-center hover:cursor-pointer"
        onClick={() => {
          handleZoomStory(story);
        }}>
        <StoryImgWithBlurhash
          type="story"
          imageSrc={story.imageUrl}
          owner={story.name}
          blurhash={story.blurhashString}
        />
      </div>

      <div className="flex gap-5 text-gray-600 dark:text-inherit">
        <button
          className="hover:text-blue-950 dark:hover:text-white"
          onClick={() => {
            handleZoomStory(story);
          }}>
          <HiOutlineEye className="size-10" />
        </button>
        <button
          aria-label="Delete story"
          disabled={isDeletingStory}
          onClick={() => {
            handleDeleteStory(story.id);
          }}>
          {isDeletingStory ? (
            <CgSandClock className="size-10 animate-bounce text-gray-700" />
          ) : (
            <MdDeleteOutline className="size-10 hover:text-red-700/70" />
          )}
        </button>
      </div>
    </div>
  );
}

export default StoryItemControl;
