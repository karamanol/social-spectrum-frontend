import axios from "axios";
import { PostCommentType } from "../components/Comments";

export async function getComments({ postId }: { postId: number }) {
  const res = await axios.get(
    `/comments?${new URLSearchParams({ postId: postId.toString() })}`
  );

  const comments: PostCommentType[] = res.data;
  return comments;
}

export async function addComment({
  textContent,
  postId,
}: {
  textContent: string;
  postId: number;
}) {
  if (textContent.length > 250) {
    throw new Error(
      "Whoops! Your message is a bit long. To keep things clear and concise, posts are limited to 250 characters."
    );
  }

  const res = await axios.post("/comments", { textContent, postId });

  return res.data;
}

export async function deleteComment(commentId: number) {
  await axios.delete(`/comments/${commentId}`);
}
