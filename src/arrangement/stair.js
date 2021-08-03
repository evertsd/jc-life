import { invert } from './util';
import { getKey, transpose } from '../Game/utils';

export const positions = [
  { x: 2, y: 0 },
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 0, y: 2 },
  { x: 3, y: 2 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 1, y: 4 },
  { x: 2, y: 4 },
  { x: 1, y: 5 },
  { x: 2, y: 5 },
  { x: 0, y: 6 },
  { x: 3, y: 6 },
  { x: 1, y: 7 },
  { x: 3, y: 7 },
  { x: 2, y: 8 },
];

export const createSimple = function (bits, size, xOffset, yOffset) {
  const calculateX = (x) => x * size.width + xOffset;
  const calculateY = (y) => y * size.height + yOffset;

  return positions.map(position =>
    getKey(transpose(position, calculateX, calculateY), bits)
  );
};

export const createComplex = function (bits, size, xOffset, yOffset) {
  const calculateX = (xo) =>
    (x) => x * size.width + xOffset + xo;

  const calculateY = (yo) =>
    (y) => y * size.height + yOffset + yo;

  const left = positions.map(position =>
    getKey(transpose(position, calculateX(-6 * size.width), calculateY(0)), bits)
  );

  const right = invert(positions).map(position =>
    getKey(transpose(position, calculateX(6 * size.width), calculateY(0)), bits)
  );

  return [...left, ...right];
}

export const create = createComplex;
