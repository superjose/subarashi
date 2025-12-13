import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq } from "drizzle-orm";
import type { Env } from "./shared/env";
import { createDb, schema } from "./db";

const app = new Hono<{ Bindings: Env }>();

// Apply CORS middleware to all routes
app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "HEAD", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
  maxAge: 86400,
}));

// Root endpoint
app.get("/", (c) => {
  return c.text(
    "Call /api/series to get all series\n" +
    "Call /api/series/:seriesId to get a specific series\n" +
    "Call /api/series/:seriesId/chapters to get all chapters for a series\n" +
    "Call /api/subtitles/series/:seriesId/:chapterId to fetch subtitle files"
  );
});

// Get all series
app.get("/api/series", async (c) => {
  const db = createDb(c.env.subarashi_db);
  const allSeries = await db.select().from(schema.series);
  return c.json(allSeries);
});

// Get a specific series
app.get("/api/series/:seriesId", async (c) => {
  const seriesId = c.req.param("seriesId");
  const db = createDb(c.env.subarashi_db);
  const result = await db
    .select()
    .from(schema.series)
    .where(eq(schema.series.seriesId, seriesId));

  if (result.length === 0) {
    return c.json({ error: "Series not found" }, 404);
  }

  return c.json(result[0]);
});

// Get all chapters for a series
app.get("/api/series/:seriesId/chapters", async (c) => {
  const seriesId = c.req.param("seriesId");
  const db = createDb(c.env.subarashi_db);
  const chaptersList = await db
    .select()
    .from(schema.chapters)
    .where(eq(schema.chapters.seriesId, seriesId));

  return c.json(chaptersList);
});

// Beverages endpoint (legacy - keeping for backwards compatibility)
app.get("/api/beverages", async (c) => {
  const { results } = await c.env.subarashi_db
    .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
    .bind("Bs Beverages")
    .run();
  return c.json(results);
});

// Subtitles endpoint
app.get("/api/subtitles/series/:seriesId/:chapterId", async (c) => {
  const seriesId = c.req.param("seriesId");
  const chapterId = c.req.param("chapterId");

  try {
    // Construct the R2 object key: seriesId/chapterId.ass
    const objectKey = `${seriesId}/${chapterId}.ass`;

    // Fetch the subtitle file from R2
    const object = await c.env.SUBARASHI_SUBS.get(objectKey);

    if (object === null) {
      return c.json(
        {
          error: "Subtitle not found",
          key: objectKey,
        },
        404
      );
    }

    // Return the subtitle file with appropriate headers
    return new Response(object.body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": object.size.toString(),
        "ETag": object.httpEtag,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching subtitle from R2:", error);
    return c.json(
      {
        error: "Failed to fetch subtitle",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default app;
