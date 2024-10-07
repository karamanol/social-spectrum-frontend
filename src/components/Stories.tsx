import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useAuth } from "../context/authContext";
import { cn } from "../utils/cn";
import AddStoryModal from "./AddStoryModal";
import { useGetStories } from "../hooks/reactQueryHooks/stories/useGetStories";
import { useEffect, useRef, useState } from "react";
import StoriesModal from "./StoriesModal";
import SpinnerCircle from "./SpinnerCircle";
import StoryIcon from "./StoryIcon";
import defaultProfilePhoto from "../assets/default-user.jpg";

export type StoryType = {
  id: number;
  storyUserId: number;
  imageUrl: string;
  createdAt: string;
  name: string;
  profilePicture?: string;
  blurhashString?: string;
};

const storiesChangingSpeed = 4000;

function Stories() {
  const [isActiveStoriesViewer, setIsActiveStoriesViewer] =
    useState<boolean>(false);
  const [storyIndex, setStoryIndex] = useState<number>(0);
  const { currentUser } = useAuth();
  const { stories, error, isLoading } = useGetStories();

  const handleClickStoryIcon = (index: number) => {
    setIsActiveStoriesViewer(true);
    setStoryIndex(index);
  };

  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    if (!stories?.length || !isActiveStoriesViewer)
      return clearInterval(intervalId.current || undefined);

    const moveToNextIndex = () => {
      setStoryIndex((prevIndex) => {
        if (prevIndex === stories.length - 1) setIsActiveStoriesViewer(false);
        return (prevIndex + 1) % stories.length;
      });
    };

    intervalId.current = setInterval(() => {
      moveToNextIndex();
    }, storiesChangingSpeed);

    return () => {
      clearInterval(intervalId.current!);
    };
  }, [stories?.length, isActiveStoriesViewer, storyIndex]);

  return (
    <>
      <ul className="flex gap-3 overflow-auto pt-1 pb-3 max-w-7xl mx-auto">
        <li>
          <AddStoryModal className="flex flex-col items-center hover:drop-shadow ml-1 group transition-shadow">
            <div className="relative">
              <img
                draggable={false}
                src={currentUser?.profilePicture || defaultProfilePhoto}
                alt="User"
                className={cn(
                  "absolute h-24 w-24 object-cover rounded-full opacity-60 dark:opacity-30",
                  !currentUser?.profilePicture
                    ? "opacity-30 dark:opacity-50"
                    : null
                )}
              />

              <MdOutlineAddPhotoAlternate
                className={cn(
                  "w-24 h-24 scale-50 text-neutral-800/80 dark:text-inherit z-10 transition-transform",
                  currentUser?.profilePicture ? "group-hover:scale-[52%]" : null
                )}
              />
            </div>
            <span className="font-semibold text-sm text-center">Add story</span>
          </AddStoryModal>
        </li>

        {error ? (
          <div className="pt-1 h-24 flex items-center justify-center w-full text-gray-400">
            Something went wrong loading strories...
          </div>
        ) : isLoading ? (
          <SpinnerCircle
            containerClassName="w-full"
            iconClassName="fill-gray-500"
            loadingMessage="Checking for stories..."
          />
        ) : Array.isArray(stories) && stories.length === 0 ? (
          <div className="self-center mx-auto text-sm text-gray-400">
            Your stories and your friends stories will appear here
          </div>
        ) : (
          Array.isArray(stories) &&
          stories.map((story, idx) => (
            <li
              className="hover:cursor-pointer"
              onClick={() => handleClickStoryIcon(idx)}
              key={story.id}>
              <StoryIcon story={story} />
            </li>
          ))
        )}
      </ul>

      {Array.isArray(stories) && stories.length > 0 && (
        <StoriesModal
          stories={stories}
          storyIndex={storyIndex}
          isOpen={isActiveStoriesViewer}
          setIsOpen={setIsActiveStoriesViewer}
          setStoryIndex={setStoryIndex}
        />
      )}
    </>
  );
}

export default Stories;
