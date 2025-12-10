import { HttpClient } from "../api/client";
import { getEnv } from "./env";

export function getContext() {
  const env = getEnv(import.meta.env);
  const httpClient = new HttpClient(env.VITE_API_URL);
  return {
    env,
    httpClient,
  };
}

export type AppContext = ReturnType<typeof getContext>;
