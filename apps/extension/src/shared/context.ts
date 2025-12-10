import { HttpClient } from "../api/client";
import { getEnv } from "./env";

export function getContext() {
  const env = getEnv(process.env);
  const httpClient = new HttpClient(env.VITE_API_URL);
  return {
    env,
    httpClient,
  };
}
