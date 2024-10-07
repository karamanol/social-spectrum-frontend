import { ReactNode } from "react";
import Swal from "sweetalert2";
import { cn } from "../utils/cn";
import { useAddStory } from "../hooks/reactQueryHooks/stories/useAddStory";
import { useQueryClient } from "@tanstack/react-query";

type AddStoryProps = {
  children: ReactNode;
  className?: string;
};

function AddStoryModal({ children, className }: AddStoryProps) {
  const { mutate: uploadStory, isUploadingStory } = useAddStory();

  const queryClient = useQueryClient();

  const openSwalDialog = () => {
    Swal.fire({
      title: "Share a story with your friends",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your story",
      },
      html: "<span>Max image size: 500KB</span>",
      color: document.documentElement.classList.contains("dark")
        ? "#dedede"
        : undefined,
      showCancelButton: true,
      confirmButtonText: "Upload",
      background: document.documentElement.classList.contains("dark")
        ? "#292d35"
        : undefined,

      scrollbarPadding: false,
      confirmButtonAriaLabel: "Upload",
      confirmButtonColor: "#818cf8",
      showLoaderOnConfirm: true,

      preConfirm: async (img) => {
        if (!img) {
          Swal.fire({
            icon: "error",
            text: "Select an image!",
            background: document.documentElement.classList.contains("dark")
              ? "#292d35"
              : undefined,
            color: document.documentElement.classList.contains("dark")
              ? "#dedede"
              : undefined,
          });
        }
        if (img instanceof File && img.size > 500000) {
          Swal.fire({
            icon: "error",
            text: "Story size must be less than 500 KB",
            background: document.documentElement.classList.contains("dark")
              ? "#292d35"
              : undefined,
            color: document.documentElement.classList.contains("dark")
              ? "#dedede"
              : undefined,
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        uploadStory(
          { image: result.value },
          {
            onSuccess: () => {
              Swal.fire({
                title: "Story added successfully",
                showConfirmButton: false,
                timer: 1700,
                timerProgressBar: true,
                icon: "success",
                scrollbarPadding: false,
                background: document.documentElement.classList.contains("dark")
                  ? "#20232a"
                  : undefined,
                color: document.documentElement.classList.contains("dark")
                  ? "#dedede"
                  : undefined,
              });
              queryClient.invalidateQueries({ queryKey: ["stories"] });
            },
          }
        );
      }
    });
  };

  return (
    <button
      aria-label="Add own story"
      className={cn(
        isUploadingStory ? "animate-[pulse_1.5s_ease-in-out_infinite]" : null,
        className
      )}
      onClick={openSwalDialog}
      disabled={isUploadingStory}>
      {children}
    </button>
  );
}

export default AddStoryModal;
