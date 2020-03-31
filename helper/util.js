import keyBy from '../libs/keyBy';

export const merge = function(from, to) {
  from = keyBy(from, 'id');
  to.forEach(item => {
    from[item.id] = item;
  });
  return Object.values(from);
};

export function toMinute(sec) {
  sec = Math.round(sec);
  return `${fillTen(sec / 60 >> 0)}:${fillTen(sec % 60)}`;
}

export function fillTen(number) {
  return number > 9 ? number : ('0' + number);
}
