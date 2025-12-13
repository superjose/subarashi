import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const series = sqliteTable("Series", {
  seriesId: text("seriesId").notNull().primaryKey(),
  name: text("name").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const chapters = sqliteTable("Chapters", {
  chapterId: text("chapterId").notNull().primaryKey(),
  seriesId: text("seriesId")
    .notNull()
    .references(() => series.seriesId),
  subtitleLocation: text("subtitleLocation").notNull(),
  chapterNumber: integer("chapterNumber"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
