import { Dispatch, SetStateAction, useState } from "react";
import { Blurhash } from "react-blurhash";
import { cn } from "../utils/cn";
import SpinnerCircle from "./SpinnerCircle";

type ImageWithBlurhashProps = {
  imageSrc: string;
  owner: string;
  blurhash?: string;
  width?: string;
  height?: string;
  imgClassName?: string;
  setImageHasLoaded?: Dispatch<SetStateAction<boolean>>;
  type: "post" | "story";
};

function ImageWithBlurhash({
  imageSrc,
  blurhash,
  width,
  height,
  owner,
  type,
  imgClassName,
  setImageHasLoaded,
}: ImageWithBlurhashProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <>
      {isImageLoading && blurhash ? (
        <div className="relative w-full h-full">
          <Blurhash
            hash={blurhash}
            width={width ?? "100%"}
            height={height ?? "100%"}
            punch={1}
          />
          <SpinnerCircle
            containerClassName="w-full h-full absolute top -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2"
            iconClassName="size-10 fill-gray-400 text-transparent"
          />
        </div>
      ) : null}
      <img
        onLoad={() => {
          setIsImageLoading(false);
          if (setImageHasLoaded) setImageHasLoaded(true);
        }}
        draggable={false}
        src={imageSrc}
        alt={`${owner}s' ${type}`}
        className={cn(
          "object-contain",
          imgClassName,
          isImageLoading ? "hidden" : "inline"
        )}
      />
    </>
  );
}

export default ImageWithBlurhash;
