import { z } from "zod";
const EnvSchema = z.object({
  VITE_API_URL: z.string(),
});
export type SubarashiEnv = z.infer<typeof EnvSchema>;

export function getEnv(env: Record<string, unknown>): SubarashiEnv {
  try {
    return EnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment validation failed:");
      error.issues.forEach((issue) => {
        console.error(`- ${issue.path.join(".")}: ${issue.message}`);
      });
    }
    throw error;
  }
}
