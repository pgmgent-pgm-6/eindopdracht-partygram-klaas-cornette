import { Body, Tables } from "database.types";

export type Story = Tables<"stories">;


export type CreateStoriesBody = Body<"stories">["Insert"];
export type UpdateStoriesBody = Body<"stories">["Update"];
