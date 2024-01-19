import { supabase } from "@core/api/supabase";
import { CreateMessagesBody, Messages } from "./types";


export const getMessages = async (): Promise<Messages[] | null> => {
  const { data } = await supabase.from("messages").select("*").order("created_at").throwOnError();
  return Promise.resolve(data);
};

export const createMassage = async (message: CreateMessagesBody) => {
  console.log(message)
  const response = await supabase.from("messages").insert(message).select().throwOnError().single();
  return Promise.resolve(response.data);
};
