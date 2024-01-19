import { Body, Tables } from "database.types";

export type favorites = Tables<"favorites">;
export type CreatefavoritesBody = Body<"favorites">["Insert"];


