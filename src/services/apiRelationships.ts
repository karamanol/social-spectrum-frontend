import axios from "axios";

export async function getUserFollowers({
  userId,
}: {
  userId: string | undefined;
}) {
  if (!userId) return [];
  const res = await axios.get(
    `/relationships?${new URLSearchParams({ userId })}`
  );

  if (res.data && Array.isArray(res.data) && res.data.length) {
    return res.data.map((el) => el.isFollowingId);
  }
  return res.data;
}

export type FollowedUserType = {
  id: number;
  name: string;
  profilePicture?: string;
  role: string;
  statusText?: string;
  username: string;
  visibility: "online" | "invisible";
};

export async function getWhoIsUserFollowing() {
  // User ID will be extracted from JWT
  const res = await axios.get(`/relationships/followed-users`);
  if (!Array.isArray(res?.data))
    throw new Error("Something went wrong while getting users you follow");
  return res.data as FollowedUserType[];
}

export async function followUser(userIdToFollow: string | number | undefined) {
  if (!userIdToFollow) return;
  await axios.post("/relationships", { userIdToFollow });
}
export async function unfollowUser(userIdToUnfollow: string | undefined) {
  if (!userIdToUnfollow) return;
  await axios.delete(
    `/relationships?${new URLSearchParams({ userIdToUnfollow })}`
  );
}
