import { useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import useTextAreaAutoResize from "../hooks/useTextAreaAutoResize";
import { FaRegImage } from "react-icons/fa";
import { useAddPost } from "../hooks/reactQueryHooks/posts/useAddPost";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "../utils/getErrorMessage";
import { AxiosError } from "axios";
import { MdDeleteOutline } from "react-icons/md";
import defaultUserImage from "../assets/default-user.jpg";

function AddPostForm() {
  const { currentUser } = useAuth();

  const [textValue, setTextValue] = useState("");
  const [postImage, setPostImage] = useState<File>();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useTextAreaAutoResize(textAreaRef.current, textValue);

  const queryClient = useQueryClient();
  const { mutate: addPost, isAddingPost } = useAddPost();

  const handleAddPost = () => {
    if (!textValue) {
      Swal.fire({
        title: "Add some description to post",
        toast: true,
        showConfirmButton: false,
        icon: "warning",
        timer: 2000,
        position: "top-right",
      });

      return;
    }

    addPost(
      { textContent: textValue, image: postImage },
      {
        onSuccess: () => {
          Swal.fire({
            title: "Post added successfully",
            showConfirmButton: false,
            timer: 1700,
            timerProgressBar: true,
            icon: "success",
            scrollbarPadding: false,
            background: document.documentElement.classList.contains("dark")
              ? "#20232a"
              : undefined,
          });
          setTextValue("");
          setPostImage(undefined);
          queryClient.invalidateQueries({ queryKey: ["posts"] });
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
            scrollbarPadding: false,
            icon: "error",
            background: document.documentElement.classList.contains("dark")
              ? "#20232a"
              : undefined,
          });
        },
      }
    );
  };

  return (
    <div className="bg-white dark:bg-[#20232a90] rounded-lg py-5 px-3 my-5 sm:my-7 sm:px-7 dark:text-gray-300 mt-3 drop-shadow-sm max-w-7xl mx-auto">
      <form>
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.profilePicture || defaultUserImage}
            alt={currentUser?.name || ""}
            className="h-10 w-10 min-w-10 rounded-full object-cover self-start"
          />
          <textarea
            spellCheck={false}
            className="border dark:border-gray-500 rounded-xl w-full p-2 max-h-96 resize-none bg-gray-50/50 dark:bg-[#282C34] focus:outline-none focus:border-gray-400 no-scrollbar"
            onChange={(e) => setTextValue(e.target?.value)}
            placeholder="Start a new post"
            ref={textAreaRef}
            rows={1}
            value={textValue}
          />
        </div>
        <div className="mt-5 flex justify-between items-center">
          <div className="flex items-center gap-4 ml-2">
            <label
              htmlFor="file"
              aria-label="Attach image to post"
              className="cursor-pointer">
              <FaRegImage className="size-[26px] text-gray-700 dark:text-gray-200 hover:opacity-90" />
              <input
                id="file"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return;
                  setPostImage(e.target.files[0]);
                }}
              />
            </label>

            {postImage ? (
              <div className="gap-3 flex items-center justify-center">
                <img
                  alt=""
                  src={URL.createObjectURL(postImage)}
                  className="h-8 ml-3 drop-shadow"
                />
                <button
                  className="text-gray-700 dark:text-gray-200 hover:text-red-700"
                  onClick={() => {
                    setPostImage(undefined);
                  }}>
                  <MdDeleteOutline className="h-7 w-7" />
                </button>
              </div>
            ) : null}
          </div>
          <button
            disabled={isAddingPost}
            type="button"
            onClick={handleAddPost}
            className="bg-slate-800 dark:bg-gray-700 hover:opacity-95 px-3 py-1 rounded text-gray-100 dark:text-gray-200 shadow">
            {isAddingPost ? "Adding..." : "Add post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPostForm;
