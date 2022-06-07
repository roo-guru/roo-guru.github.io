import { useEffect, useState } from 'react';
import { Artist, FestivalData, Show, Venue } from './types';

const SHOWS_URI =
  'https://goeventweb-static.greencopper.com/1d8236e2728f4247b5c686d8a31a29cc/bonnaroo-2022/data/eng/shows.json';
const ARTISTS_URI =
  'https://goeventweb-static.greencopper.com/1d8236e2728f4247b5c686d8a31a29cc/bonnaroo-2022/data/eng/artists.json';
const VENUES_URI =
  'https://goeventweb-static.greencopper.com/1d8236e2728f4247b5c686d8a31a29cc/bonnaroo-2022/data/eng/venues.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = Record<number, any>;

async function fetchData(uri: string): Promise<Data> {
  const response = await fetch(uri);
  return await response.json();
}

const venueNameOverride: { [index: number]: string } = {
  317: 'Where In The Woods',
  675: 'Beach Stage',
};

const venueSortOverride: { [index: number]: number } = {
  317: 10, // Where in the Woods
  675: 20, // Beach Stage
  325: 30, // The Beyond
  321: 40, // Plaza 2
  323: 50, // Plaza 3
  322: 60, // Plaza 5
  327: 70, // Plaza 7
  329: 80, // House of MatROOmony
};

async function fetchFestivalData(): Promise<FestivalData> {
  const [showData, artistData, venueData] = await Promise.all([
    fetchData(SHOWS_URI),
    fetchData(ARTISTS_URI),
    fetchData(VENUES_URI),
  ]);

  const shows: Show[] = Object.values(showData).map((s) => ({
    id: s._id,
    start: new Date(`${s.date_start}T${s.time_start}`),
    end: new Date(`${s.date_end}T${s.time_end}`),
    artist: {
      id: artistData[s.object._id]._id,
      name: artistData[s.object._id].title,
      url: '',
      photo: '',
      spotify: '',
    },
    venue: {
      id: s.venue._id,
      name: venueNameOverride[s.venue._id] || s.venue.title,
    },
  }));

  const venues: Venue[] = Object.values(venueData).map((v) => ({
    id: v._id,
    name: venueNameOverride[v._id] || v.title,
    sortOrder: venueSortOverride[v._id] || v.sort_order || 99,
    shows: Object.values(showData)
      .filter((s) => s.venue._id === v._id)
      .map((s) => ({
        id: s._id,
        start: new Date(`${s.date_start}T${s.time_start}`),
        end: new Date(`${s.date_end}T${s.time_end}`),
        artist: {
          id: artistData[s.object._id]._id,
          name: artistData[s.object._id].title,
          url: '',
          photo: '',
          spotify: '',
        },
        venue: {
          id: s.venue._id,
          name: venueNameOverride[s.venue._id] || s.venue.title,
        },
      })),
  }));

  const artists: Artist[] = Object.values(artistData).map((a) => ({
    id: a._id,
    name: a.title,
    url: '',
    photo: '',
    spotify: '',
    shows: Object.values(showData)
      .filter((s) => s.object._id === a._id)
      .map((s) => ({
        id: s._id,
        start: new Date(`${s.date_start}T${s.time_start}`),
        end: new Date(`${s.date_end}T${s.time_end}`),
        artist: {
          id: artistData[s.object._id]._id,
          name: artistData[s.object._id].title,
          url: '',
          photo: '',
          spotify: '',
        },
        venue: {
          id: s.venue._id,
          name: venueNameOverride[s.venue._id] || s.venue.title,
        },
      })),
  }));

  shows.sort((a, b) => a.start.getTime() - b.start.getTime());
  venues.sort((a, b) => a.sortOrder - b.sortOrder);
  console.log({
    shows,
    artists,
    venues,
  });

  return { artists, venues, shows };
}

export function useFestivalData() {
  const [festivalData, setFestivalData] = useState<FestivalData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      const data = await fetchFestivalData();
      if (cancelled) return;
      setFestivalData(data);
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return festivalData;
}
