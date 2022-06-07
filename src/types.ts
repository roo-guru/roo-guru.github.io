export type Artist = {
  id: number;
  name: string;
  url: string;
  photo: string;
  spotify: string;
  shows: Show[];
};

export type Venue = {
  id: number;
  name: string;
  sortOrder: number;
  shows: Show[];
};

export type Show = {
  id: number;
  artist: Omit<Artist, 'shows'>;
  venue: Omit<Venue, 'shows' | 'sortOrder'>;
  start: Date;
  end: Date;
};

export type FestivalData = {
  artists: Artist[];
  venues: Venue[];
  shows: Show[];
};
