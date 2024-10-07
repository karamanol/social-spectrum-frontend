import axios from "axios";
import { StoryType } from "../components/Stories";

export async function addStory({ image }: { image: File }) {
  if (image && image.size >= 500000) {
    throw new Error("Image size exceeded. Max size is 500KB");
  }

  const formData = new FormData();
  formData.append("image", image);

  const res = await axios.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getStories() {
  const res = await axios.get("/stories");
  return res.data as StoryType[];
}

export async function getStoriesByUserId(id: number) {
  if (!id) return [];
  const res = await axios.get(
    `/stories?${new URLSearchParams({ userId: `${id}` })}`
  );
  return res.data as StoryType[];
}

export async function deleteStoryById(storyId: number) {
  const res = await axios.delete(`/stories/${storyId}`);
  return res.data;
}
