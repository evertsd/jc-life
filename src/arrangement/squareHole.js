import { getKey, transpose } from '../Game/utils';

export const positions = [
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 3, y: 2 }
];

export const createSimple = function (bits, size, xOffset, yOffset) {
  const calculateX = (x) => x * size.width + xOffset;
  const calculateY = (y) => y * size.height + yOffset;

  return positions.map(position =>
    getKey(transpose(position, calculateX, calculateY), bits)
  );
};

export const createTriLife = function (bits, size, xOffset, yOffset) {
  const offset = 3;
  const calculateX = (xo) =>
    (x) => x * size.width + xOffset + xo;

  const calculateY = (yo) =>
    (y) => y * size.height + yOffset + yo;

  const top = positions.map(position =>
    getKey(transpose(position, calculateX(-1 * offset * size.width), calculateY(-1 * offset * size.height)), bits)
  );

  const left = positions.map(position =>
    getKey(transpose(position, calculateX(-1 * offset * size.width), calculateY(offset * size.height)), bits)
  );

  const bottom = positions.map(position =>
    getKey(transpose(position, calculateX(offset * size.width), calculateY(-1 * offset * size.height)), bits)
  );

  const right = positions.map(position =>
    getKey(transpose(position, calculateX(offset * size.width), calculateY(offset * size.height)), bits)
  );

  return [...top, ...left, ...bottom, ...right];
};

export const createComplex = function (bits, size, xOffset, yOffset) {
  const offset = 5;
  const calculateX = (xo) =>
    (x) => x * size.width + xOffset + xo;

  const calculateY = (yo) =>
    (y) => y * size.height + yOffset + yo;

  const top = positions.map(position =>
    getKey(transpose(position, calculateX(-1 * offset * size.width), calculateY(-1 * offset * size.height)), bits)
  );

  const left = positions.map(position =>
    getKey(transpose(position, calculateX(-1 * offset * size.width), calculateY(offset * size.height)), bits)
  );

  const bottom = positions.map(position =>
    getKey(transpose(position, calculateX(offset * size.width), calculateY(-1 * offset * size.height)), bits)
  );

  const right = positions.map(position =>
    getKey(transpose(position, calculateX(offset * size.width), calculateY(offset * size.height)), bits)
  );

  return [...top, ...left, ...bottom, ...right, ...createSimple(bits, size, xOffset, yOffset)];
}

export const create = createTriLife;
