import axios from "axios";
import { ProfileUpdateFormValues } from "../pages/update-profile/UpdateProfile";

export async function getUser({ userId }: { userId: string }) {
  const res = await axios.get(`/users/${userId}`);
  return res.data;
}
export async function getSuggestedUsers() {
  const res = await axios.get(`/users/suggested`);
  return res.data;
}

export async function getFriendsOnline() {
  const res = await axios.get(`/users/online`);
  return res.data;
}

export async function updateUserInfo(dataToUpdate: ProfileUpdateFormValues) {
  await axios.patchForm("/users", dataToUpdate);
}
export async function deleteUserAccountById(id: number) {
  if (!id) return;
  await axios.delete(`/users/${id}`);
}

export async function checkUserPassword(password: string) {
  const res = await axios.post("/users/password-check", { password });
  return res.data;
}

type VisibilityDataType = {
  userId: string;
  visibility: "online" | "invisible";
};

export async function changeUserVisibility({
  userId,
  visibility,
}: VisibilityDataType) {
  const res = await axios.patch(`/users/${userId}/status`, { visibility });
  return res.data;
}
