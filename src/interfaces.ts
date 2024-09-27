export interface JobMetadata {
    id: number;
    title: string;
    url: string;
    time: number;
  }

export type NumberDictionary<T> = {
    [key: number]: T;
  };