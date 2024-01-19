import { supabase } from "@core/api/supabase";
import { CreatePostBody, Post, UpdatePostBody } from "./types";


export const getPosts = async (): Promise<Post[] | null> => {
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).throwOnError();
  return Promise.resolve(data);
};

export const getPostsById = async (uid: string | number) => {
  const response = await supabase
    .from("posts")
    .select("*")
    .eq("id", uid)
    .throwOnError()
    .single();
  return Promise.resolve(response.data);
};

export const createPost = async (post: CreatePostBody) => {
  console.log(post)
  const response = await supabase.from("posts").insert(post).select().throwOnError().single();
  return Promise.resolve(response.data);
};

export const updateProject = async (post: UpdatePostBody) => {
  const response = await supabase
    .from("posts")
    .update(post)
    .eq("id", post.id)
    .select()
    .throwOnError()
    .single();
  return Promise.resolve(response.data);
};

