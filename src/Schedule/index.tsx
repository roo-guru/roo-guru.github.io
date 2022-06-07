import React from 'react';
import { compareAsc, differenceInMinutes } from 'date-fns';
import { addHours } from 'date-fns/fp';
import { FestivalData, Show } from '../types';
import {
  START_TIME,
  END_TIME,
  weekdayFormatter,
  shortWeekdayFormatter,
  timeFormatter,
} from '../datetime';

function datesInRange(
  start: Date,
  end: Date,
  compare: (a: Date | number, b: Date | number) => number,
  next: (d: Date) => Date,
): Date[] {
  const result: Date[] = [];
  for (let t = start; compare(end, next(t)) > -1; t = next(t)) {
    result.push(t);
  }
  return result;
}

function getShowtimeIndex(show: Show) {
  const startIndex = differenceInMinutes(show.start, START_TIME) / 15 + 1;
  const endIndex = differenceInMinutes(show.end, START_TIME) / 15 + 1;

  return [Math.round(startIndex), Math.round(endIndex)];
}

const firstShow = (shows: Show[]) =>
  shows.reduce((a, b) => (a.start > b.start ? a : b));

export const Schedule = ({
  festivalData: { shows, venues },
}: {
  festivalData: FestivalData;
}) => {
  console.log('first: ', firstShow(shows));

  return (
    <div id="schedule">
      <div id="timeline">
        {datesInRange(START_TIME, END_TIME, compareAsc, addHours(1)).map(
          (time) => (
            <div key={time.getTime()}>
              {shortWeekdayFormatter.format(time)} {timeFormatter.format(time)}
            </div>
          ),
        )}
      </div>
      <div id="venues">
        {venues.map((venue) => (
          <div key={venue.id}>{venue.name}</div>
        ))}
      </div>
      <div id="shows">
        {[...Array(14).keys()].map((i) => (
          <div
            key={i}
            className="grid-line-x"
            style={{
              gridColumn: i + 1,
              gridRowStart: 1,
              gridRowEnd: 501,
            }}
          />
        ))}
        {[...Array(125).keys()].map((i) => (
          <div
            key={i}
            className="grid-line-y"
            style={{
              gridRowStart: i * 4 + 1,
              gridRowEnd: i * 4 + 5,
              gridColumnStart: 1,
              gridColumnEnd: 15,
            }}
          />
        ))}
        {shows.map((show) => {
          const gridColumn =
            venues.findIndex((v) => v.id === show.venue.id) + 1;
          const [gridRowStart, gridRowEnd] = getShowtimeIndex(show);
          return (
            <div
              key={show.id}
              className="show"
              style={{
                gridColumn,
                gridRowStart,
                gridRowEnd,
              }}
            >
              <div className="show-name">{show.artist.name}</div>
              <div className="show-time">
                {weekdayFormatter.format(show.start)}
                <br />
                {timeFormatter.format(show.start)}-
                {timeFormatter.format(show.end)}
              </div>
            </div>
          );
        })}
      </div>
      <div id="blank"></div>
    </div>
  );
};
