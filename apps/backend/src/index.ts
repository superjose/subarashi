export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);

    // Match pattern: /api/subtitles/series/:seriesId/:chapterId
    const subtitleMatch = pathname.match(/^\/api\/subtitles\/series\/([^\/]+)\/([^\/]+)$/);

    if (subtitleMatch) {
      const [, seriesId, chapterId] = subtitleMatch;

      try {
        // Construct the R2 object key: seriesId/chapterId.ass
        const objectKey = `${seriesId}/${chapterId}.ass`;

        // Fetch the subtitle file from R2
        const object = await env.SUBARASHI_SUBS.get(objectKey);

        if (object === null) {
          return new Response(
            JSON.stringify({
              error: "Subtitle not found",
              key: objectKey
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" }
            }
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
        return new Response(
          JSON.stringify({
            error: "Failed to fetch subtitle",
            message: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    if (pathname === "/api/beverages") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.subarashi_db
        .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
        .bind("Bs Beverages")
        .run();
      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages\nCall /api/subtitles/series/:seriesId/:chapterId to fetch subtitle files"
    );
  },
} satisfies ExportedHandler<Env>;
