import { useState } from "react";
import ImageWithBlurhash from "./ImageWithBlurhash";
import { StoryType } from "./Stories";
import { useDeleteStory } from "../hooks/reactQueryHooks/stories/useDeleteStory";
import { useAuth } from "../context/authContext";

function StoryIcon({ story }: { story: StoryType }) {
  const { mutate: deleteStory } = useDeleteStory();
  const { currentUser } = useAuth();
  const [imageHasLoaded, setImageHasLoaded] = useState(false);

  return (
    <figure>
      <div className="relative h-[96px] w-[96px] rounded-full overflow-hidden bg-gradient-to-br from-fuchsia-700 to-orange-500 drop-shadow">
        <ImageWithBlurhash
          imgClassName="absolute h-[90px] w-[90px] object-cover rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 border dark:border-gray-900"
          imageSrc={story.imageUrl}
          owner={story.name}
          type="story"
          blurhash={story.blurhashString}
          setImageHasLoaded={setImageHasLoaded}
        />
        {imageHasLoaded && (
          <div className="inset-0 absolute bg-gradient-to-b from-transparent via-gray-50/75 dark:via-gray-900/50 to-transparent rotate"></div>
        )}
        {currentUser?.role === "admin" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteStory(story.id);
            }}
            className="z-20 absolute top-3 left-1/2 -translate-x-1/2 bg-red-500 rounded text-sm px-0.5 hover:bg-red-700">
            DELETE
          </button>
        )}
      </div>
      <figcaption className="overflow-hidden overflow-ellipsis text-nowrap max-w-24 text-sm text-center font-semibold">
        {story.name}
      </figcaption>
    </figure>
  );
}

export default StoryIcon;
