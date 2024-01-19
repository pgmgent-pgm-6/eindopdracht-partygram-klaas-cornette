import { Body, Tables } from "database.types";

export type Comment = Tables<"comments">;
export type CreateCommentBody = Body<"comments">["Insert"];

