export type MessageData =
  | {
      type: "SUBARASHI_LOAD_SUBTITLES";
      subContent: string;
    }
  | {
      type: "SUBARASHI_UNLOAD_SUBTITLES";
    };
