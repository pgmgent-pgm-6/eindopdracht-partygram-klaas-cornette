import { Body, Tables } from "database.types";

export type Messages = Body<"messages">;


export type CreateMessagesBody = Body<"messages">["Insert"];
