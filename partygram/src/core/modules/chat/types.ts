import { Body, Tables } from "database.types";

export type Chats = Body<"chats">;


export type CreateChatsBody = Body<"chats">["Insert"];
