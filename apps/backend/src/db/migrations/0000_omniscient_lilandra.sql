CREATE TABLE `Chapters` (
	`chapterId` text PRIMARY KEY NOT NULL,
	`seriesId` text NOT NULL,
	`subtitleLocation` text NOT NULL,
	`chapterNumber` integer,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`seriesId`) REFERENCES `Series`(`seriesId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Series` (
	`seriesId` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
