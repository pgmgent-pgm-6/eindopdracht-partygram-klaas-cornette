import { supabase } from "@core/api/supabase";
import { CreateCommentBody, Comment } from "./types";


export const getComments = async (): Promise<Comment[] | null> => {
  const { data } = await supabase.from("comments").select("*").order("created_at").throwOnError();
  return Promise.resolve(data);
};

export const createComment = async (comments: CreateCommentBody) => {
  console.log(comments)
  const response = await supabase.from("comments").insert(comments).select().throwOnError().single();
  return Promise.resolve(response.data);
};



