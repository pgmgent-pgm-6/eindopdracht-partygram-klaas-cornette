import { Body, Tables } from "database.types";

export type Likes = Tables<"likes">;
export type CreateLikesBody = Body<"likes">["Insert"];


