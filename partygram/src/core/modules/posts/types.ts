import { Body, Tables } from "database.types";

export type Post = Tables<"posts">;


export type CreatePostBody = Body<"posts">["Insert"];
export type UpdatePostBody = Body<"posts">["Update"];
