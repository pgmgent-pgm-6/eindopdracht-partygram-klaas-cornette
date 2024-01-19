import { supabase } from "@core/api/supabase";
import { CreateChatsBody, Chats } from "./types";


export const getChats = async (): Promise<Chats[] | null> => {
  const { data } = await supabase.from("chats").select("*").order("created_at").throwOnError();
  return Promise.resolve(data);
};

export const createChat = async (chat: CreateChatsBody) => {
  const response = await supabase.from("chats").insert(chat).select().throwOnError().single();
  return Promise.resolve(response.data);
};
