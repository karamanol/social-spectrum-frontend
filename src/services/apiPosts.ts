import axios from "axios";

export async function getPosts(onlyFromGivenUserId?: string) {
  if (onlyFromGivenUserId) {
    const res = await axios.get(
      `/posts?${new URLSearchParams({ specificUserId: onlyFromGivenUserId })}`
    );
    return res.data;
  }

  const res = await axios.get("/posts");
  return res.data;
}

export async function addPost({
  textContent,
  image,
}: {
  textContent: string;
  image?: File;
}) {
  if (image && image.size >= 500000) {
    throw new Error("Image size exceeded. Max size is 500KB");
  }

  if (textContent.length > 250) {
    throw new Error(
      "Whoops! Your message is a bit long. To keep things clear and concise, posts are limited to 250 characters."
    );
  }

  const formData = new FormData();
  formData.append("textContent", textContent || "");
  if (image) {
    formData.append("image", image);
  }

  const res = await axios.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deletePost(postId: number) {
  const res = await axios.delete(`/posts/${postId}`);
  return res.data;
}

// ----- Saved posts -----
export async function getSavedPosts() {
  const res = await axios.get("/posts/saved");
  return res.data;
}

export async function addSavedPost(postId: number) {
  const res = await axios.post(`/posts/saved`, { postId });
  return res.data;
}

export async function deleteSavedPost(postId: number) {
  const res = await axios.delete(`/posts/saved/${postId}`);
  return res.data;
}
