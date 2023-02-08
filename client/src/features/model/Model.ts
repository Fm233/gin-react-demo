export interface Owner {
  Mid: string;
  Name: string;
  Face: string;
  Videos: Video[];
  TimeMs: number;
}

export interface Video {
  Bvid: string;
  Title: string;
  OwnerID: string;
  Owner: Owner;
  Pic: string;
  TimeMs: number;
  Pending: boolean;
  Valid: boolean;
}
