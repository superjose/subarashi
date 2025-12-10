-- Drop tables if they exist
DROP TABLE IF EXISTS Series;

DROP TABLE IF EXISTS Chapters;

-- Create Series table
CREATE TABLE
    IF NOT EXISTS Series (
        seriesId TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    );

-- Create Chapters table
CREATE TABLE
    IF NOT EXISTS Chapters (
        chapterId TEXT NOT NULL PRIMARY KEY,
        seriesId TEXT NOT NULL,
        subtitleLocation TEXT NOT NULL,
        -- up to 5 digits, enforced with a CHECK constraint
        chapterNumber INTEGER,
        CHECK (chapterNumber BETWEEN 0 AND 99999),
        FOREIGN KEY (seriesId) REFERENCES Series (seriesId)
    );

-- Insert data into Series
INSERT INTO
    Series (seriesId, name, createdAt, updatedAt)
VALUES
    (
        'GYQ4MW246',
        'Naruto Shippuuden',
        datetime ('now'),
        datetime ('now')
    );

-- Insert data into Chapters
INSERT INTO
    Chapters (
        chapterId,
        seriesId,
        subtitleLocation,
        chapterNumber
    )
VALUES
    (
        'G6Q4MK3GR',
        'GYQ4MW246',
        'https://dash.cloudflare.com/313b82d918201ebe1ca18c8d591deefe/r2/default/buckets/subarashi-subs/objects/GYQ4MW246%252FG6Q4MK3GR.ass/details?prefix=GYQ4MW246%2F',
        411
    );