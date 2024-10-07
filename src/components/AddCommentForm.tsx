import React, { useRef, useState } from "react";
import { cn } from "../utils/cn";
import useTextAreaAutoResize from "../hooks/useTextAreaAutoResize";
import { useAuth } from "../context/authContext";
import { AnimatePresence, motion } from "framer-motion";
import { LuSendHorizonal } from "react-icons/lu";
import defaultUserImage from "../assets/default-user.jpg";
import { useQueryClient } from "@tanstack/react-query";
import { useAddComment } from "../hooks/reactQueryHooks/comments/useAddComment";
import Swal from "sweetalert2";
import { getErrorMessage } from "../utils/getErrorMessage";
import { AxiosError } from "axios";
import { CgSandClock } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { forceUserToLogIn } from "../hooks/useHandleJwtExpiration";

function AddCommentForm({
  className,
  postId,
}: {
  className?: string;
  postId: number;
}) {
  const [textValue, setTextValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { currentUser } = useAuth();

  useTextAreaAutoResize(textAreaRef.current, textValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target?.value;
    setTextValue(val);
  };

  const queryClient = useQueryClient();
  const { mutate, isAddingComment } = useAddComment();

  const navigate = useNavigate();

  const handleAddComment = () => {
    if (!textValue) return;
    mutate(
      { textContent: textValue, postId },
      {
        onSuccess: () => {
          setTextValue("");
          queryClient.invalidateQueries({ queryKey: ["comments"] });
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (err) => {
          if (
            err instanceof AxiosError &&
            err.response?.data?.message === "jwt_error"
          ) {
            forceUserToLogIn(navigate);
          } else {
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
          }
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <div className={cn("w-full flex gap-3 p-3 mb-3", className)}>
        <img
          src={currentUser?.profilePicture || defaultUserImage}
          alt={currentUser?.name || ""}
          className="h-8 w-8 min-h-8 min-w-8 rounded-full object-cover"
        />
        <textarea
          spellCheck={false}
          className="border dark:border-gray-500  rounded-xl w-full p-2 max-h-40 resize-none rounded-ss-none bg-gray-50/50 dark:bg-[#282C34] focus:outline-none focus:border-gray-400 no-scrollbar"
          onChange={handleChange}
          placeholder="Add a comment..."
          ref={textAreaRef}
          rows={1}
          value={textValue}
        />

        {textValue && (
          <motion.button
            aria-label="Send comment"
            onClick={handleAddComment}
            disabled={isAddingComment}
            className="mt-auto text-gray-800 dark:text-inherit hover:text-gray-700 hover:drop-shadow dark:hover:text-gray-100"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}>
            {isAddingComment ? (
              <CgSandClock className="h-7 w-7 -translate-y-[6px] animate-bounce" />
            ) : (
              <LuSendHorizonal className="h-7 w-7 -translate-y-[6px]" />
            )}
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
}

export default AddCommentForm;
