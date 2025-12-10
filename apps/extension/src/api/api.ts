export const api = Object.freeze({
  get subtitles() {
    const basePath = "subtitles/series";
    return {
      chapters: (seriesId: string, chapterId: string) =>
        `${basePath}/${seriesId}/${chapterId}`,
    };
  },
});
