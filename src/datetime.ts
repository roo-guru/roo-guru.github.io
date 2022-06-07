export const START_TIME = new Date('2022-06-14T21:00');
export const END_TIME = new Date('2022-06-20T02:00');

export const weekdayFormatter = new Intl.DateTimeFormat(
  [...navigator.languages],
  {
    weekday: 'long',
  },
);
export const shortWeekdayFormatter = new Intl.DateTimeFormat(
  [...navigator.languages],
  {
    weekday: 'short',
  },
);
export const timeFormatter = new Intl.DateTimeFormat([...navigator.languages], {
  timeStyle: 'short',
});
