```prisma
model Series {
 seriesId @id
 name String
 createdAt DateTime
 updatedAt DateTime
}

model Chapters {
    chapterId  @id
    seriesId String
    subtitleLocation String

    @@index[chapterId]
}
```
