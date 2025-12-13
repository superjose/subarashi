1. TO store the TV series. (Naruto, One Piece, Bleach, etc.)
2. Series -> Episode

```prisma
model Series {
    seriesId  @@id // Crunchyroll's ID
    name String

}

model Episode {
    seriesId ULID
    episodeId ULID // Crunchyroll's ID
    subtitleLocation String // R2 Location

    @@id[episodeId]
    @@index[seriesId]
}
```

How it will work:

1. Click the load subtitle button.
2. Then I'm going to read the URL, extract the episode ID.
3. I'm going to send the payload to the Cloudflare Worker Server
4. Extract the episode ID by searching on the database, get the R2 URL, and send the subtitle file back to the frontend
5. The frontend will then load the subtitle file directly into the browser

## UI / UX (Dec. 13 - 2025)

1. Scraper

### Side Panel

Views:

- Home
  - Is divided into 2 sections
    - Currently playing:
      - Contains the episode name and the status buttons:
      - Active / Inactive.
    - Recent Episode List (Max 10)
      - Half a list of all the most episodes, up to 10?
- Series List view
  - A simple list of crunchyroll series ordered by name
  - It should have a filter button that allows us to sort by creation, updating the name into ascending and descending order.
- Episode Detail View
  - Very simple view. It will have two buttons:
    1. One that says "Load"
    2. One that says "Unload subtitles"
  - A back button with the series name that will go back.

Design:

- Layout for Side Panel
  - Header
    - Text/Episode Name for Details/Settings/List/etc.
    - Cog icon for settings placed at the right.
