import { invert } from './util';
import { getKey, transpose } from '../Game/utils';

export const positions = [
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 3, y: 2 },
  { x: 4, y: 2 },
];

const rotate = function (positions) {
  return positions.map(({ x, y }) => ({ y: x, x: y }));
};

// (-7, 9), (-9, 11), (-16, 18), (-17, 19)
// (-19, 21) LONG
// (-20, 22) COOL ARRANGEMENT NON OSCILLATING
// (-26, 28) Interesting stable life
export const create = function (bits, size, xOffset, yOffset) {
  const calculateX = (xo) =>
    (x) => x * size.width + xOffset + xo;

  const calculateY = (yo) =>
    (y) => y * size.height + yOffset + yo;

  const topPositions = positions.map(position =>
    transpose(position, calculateX(0), calculateY(-4 * size.height))
  );

  const top = topPositions.map(position =>
    getKey(position, bits)
  );

  const left = rotate(topPositions).map(position =>
    getKey(position, bits)
  );

  const bottomPositions = invert(positions).map(position =>
    transpose(position, calculateX(0), calculateY(6 * size.height))
  );

  const bottom = bottomPositions.map(position =>
    getKey(position, bits)
  );

  const right = rotate(bottomPositions).map(position =>
    getKey(position, bits)
  );

  return [...top, ...left, ...bottom, ...right];
}
