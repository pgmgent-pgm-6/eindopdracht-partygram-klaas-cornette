import { supabase } from "@core/api/supabase";
import { favorites, CreatefavoritesBody } from "./types";

export const getFavorites = async (): Promise<favorites[] | null> => {
  const { data } = await supabase
    .from("favorites")
    .select("*")
    .order("created_at")
    .throwOnError();
  return Promise.resolve(data);
};


export const createFavorite = async (post_id: number | undefined, user_id: string | undefined) => {
  if(!post_id || !user_id) return Promise.reject("post_id or user_id is undefined");
  const favorite: CreatefavoritesBody = {
    post_id: post_id,
    user_id: user_id,
  };
  const response = await supabase
    .from("favorites")
    .insert(favorite)
    .select()
    .throwOnError()
    .single();
  return Promise.resolve(response.data);
};

export const deleteFavorite = async (postId: number | undefined, userId: string | undefined) => {
  console.log(postId, userId);
  const response = await supabase
    .from("favorites")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .throwOnError();
  return Promise.resolve(response);
}
