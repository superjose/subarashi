-- Seed data for testing
INSERT INTO Series (seriesId, name, createdAt, updatedAt)
VALUES (
  'GYQ4MW246',
  'Naruto Shippuuden',
  datetime('now'),
  datetime('now')
);

INSERT INTO Chapters (chapterId, seriesId, subtitleLocation, chapterNumber)
VALUES (
  'G6Q4MK3GR',
  'GYQ4MW246',
  'GYQ4MW246/G6Q4MK3GR.ass',
  411
);
