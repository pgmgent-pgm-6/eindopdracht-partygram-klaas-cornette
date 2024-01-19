import { supabase } from "@core/api/supabase";
import { CreateLikesBody, Likes } from "./types";

export const getLikes = async (): Promise<Likes[] | null> => {
  const { data } = await supabase
    .from("likes")
    .select("*")
    .order("created_at")
    .throwOnError();
  return Promise.resolve(data);
};


export const createLike = async (post_id: number | undefined, user_id: string | undefined) => {
  if(!post_id || !user_id) return Promise.reject("post_id or user_id is undefined");
  const like: CreateLikesBody = {
    post_id: post_id,
    user_id: user_id,
  };
  const response = await supabase
    .from("likes")
    .insert(like)
    .select()
    .throwOnError()
    .single();
  return Promise.resolve(response.data);
};

export const deleteLike = async (postId: number | undefined, userId: string | undefined) => {
  const response = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .throwOnError();
  return Promise.resolve(response);
}
