import { transpose } from '../Game/utils/position';

export const rotate = function (positions) {
  return positions.map(({ x, y }) => ({ y: x, x: y }));
};

export const invert = function (positions) {
  const max = positions.reduce(function (m, position) {
    const x = position.x > m.x ? position.x : m.x;
    const y = position.y > m.y ? position.y : m.y;

    return { x, y };
  }, { x: 0, y: 0 });

  const calculateX = (x) => max.x - x;
  const calculateY = (y) => max.y - y;

  return positions.map(position => transpose(position, calculateX, calculateY));
};
