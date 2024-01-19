import { supabase } from "@core/api/supabase";
import { Story, CreateStoriesBody } from "./types";


export const getStories = async (): Promise<Story[] | null> => {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const { data } = await supabase
    .from("stories")
    .select("*")
    .filter("created_at", "gte", twentyFourHoursAgo.toISOString())
    .order("created_at", { ascending: false })
    .throwOnError();

  return Promise.resolve(data);
};


export const createStory= async (story: CreateStoriesBody) => {
  const response = await supabase.from("stories").insert(story).select().throwOnError().single();
  return Promise.resolve(response.data);
};


