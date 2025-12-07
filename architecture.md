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
