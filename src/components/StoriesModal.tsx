import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { StoryType } from "./Stories";
import StoryImgWithBlurhash from "./ImageWithBlurhash";
import { cn } from "../utils/cn";
import { Link } from "react-router-dom";
import defaultUserImage from "../assets/default-user.jpg";
import { IoIosArrowBack } from "react-icons/io";

type StoriesModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setStoryIndex: Dispatch<SetStateAction<number>>;
  storyIndex: number;
  stories: StoryType[];
};

const StoriesModal = ({
  isOpen,
  setIsOpen,
  stories,
  storyIndex,
  setStoryIndex,
}: StoriesModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDownToClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleOutsideClickToClose = (event: MouseEvent) => {
      if (
        modalRef.current &&
        progressBarRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !progressBarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      document.addEventListener("mousedown", handleOutsideClickToClose);
      document.addEventListener("keydown", handleKeyDownToClose);
    } else {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDownToClose);
      document.removeEventListener("mousedown", handleOutsideClickToClose);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClickToClose);
      document.removeEventListener("keydown", handleKeyDownToClose);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          className="fixed inset-0 z-[999] overflow-auto bg-gray-800 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          {/* Progress bar */}
          <div
            ref={progressBarRef}
            className="flex gap-2 w-full absolute top-0 rounded-full h-3 mt-[2px] z-20">
            {stories.map((story, idx) => (
              <div
                onClick={() => setStoryIndex(idx)}
                className={cn(
                  "relative w-full bg-gray-500 dark:bg-gray-700 rounded-full overflow-hidden hover:cursor-pointer shadow",
                  idx !== storyIndex ? "hover:bg-opacity-50" : null
                )}
                key={story.id}>
                <div
                  className={cn(
                    "h-full rounded-full right-full",
                    idx === storyIndex
                      ? "progress_bar_fill"
                      : idx < storyIndex
                      ? "w-full bg-white hover:bg-opacity-80"
                      : null
                  )}></div>
              </div>
            ))}
          </div>

          {/* Close button */}
          <button
            aria-label="Close modal"
            className="absolute z-50 top-4 right-4 text-gray-400  hover:text-gray-500 transition-colors"
            onClick={() => setIsOpen(false)}>
            <span className="text-7xl">&times;</span>
          </button>

          {/* Stories slider */}
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-gray-900 p-8 rounded shadow-lg max-w-[90%] min-w-[90%] sm:min-w-[50%] min-h-[50%] h-[95%] flex items-center justify-center">
            <div className="h-full w-full flex justify-center">
              {Array.isArray(stories) && stories.length ? (
                <StoryImgWithBlurhash
                  type="story"
                  imageSrc={stories[storyIndex].imageUrl}
                  blurhash={stories[storyIndex].blurhashString}
                  owner={stories[storyIndex].name}
                  key={stories[storyIndex].id}
                />
              ) : (
                <span className="text-2xl">No stories yet</span>
              )}

              {/* Author */}
              <div className="absolute bg-gradient-to-b from-black/15 to-transparent z-10 top-0 w-full h-20">
                <Link
                  to={`/profile/${stories[storyIndex].storyUserId}`}
                  className="flex flex-nowrap gap-1 items-center z-50 hover:cursor-pointer ml-2 w-fit">
                  <img
                    src={stories[storyIndex].profilePicture || defaultUserImage}
                    alt="User"
                    className="h-5 w-5 rounded-full"
                  />
                  <span className="text-nowrap overflow-hidden overflow-ellipsis text-gray-50 text_shadow p-1">
                    {stories[storyIndex].name}
                  </span>
                </Link>
              </div>

              {/* Arrows */}
              {stories.length > 1 && (
                <div className="absolute flex justify-between w-full top-1/2 -translate-y-1/2 text-gray-400 dark:text-inherit">
                  <button
                    onClick={() => setStoryIndex((i) => Math.max(i - 1, 0))}
                    className="hover:scale-110 py-3">
                    <IoIosArrowBack className="size-10" />
                  </button>
                  <button
                    onClick={() =>
                      setStoryIndex((i) => Math.min(i + 1, stories.length - 1))
                    }
                    className="py-3 hover:scale-110">
                    <IoIosArrowBack className="size-10 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesModal;
