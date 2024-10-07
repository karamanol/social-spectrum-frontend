import axios from "axios";

export async function likeAPost({ postId }: { postId: number }) {
  await axios.post(`/likes`, { postId });
}
export async function removeLikeFromPost({ postId }: { postId: number }) {
  await axios.delete(`/likes/${postId}`);
}
