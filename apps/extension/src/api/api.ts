export const api = Object.freeze({
  series: {
    chapters: (seriesId: string, chapterId: string) => {
      `/${seriesId}/${chapterId}`;
    },
  },
});
