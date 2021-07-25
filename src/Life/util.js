import { BOARD_EDGE, PIECE_COLORS } from './constants';

export const isRandomlyAlive = function () {
  return (Math.random() * 8) < 3;
};

export const buildInitialState = function (bits) {
  const pieces = {};
  const loopStart = ((Math.pow(2, bits) - 1) - BOARD_EDGE) / 2;
  const loopEnd = loopStart + BOARD_EDGE;
  const dummyPiece = createPiece(0, bits);

  let i = loopStart, j = loopStart;

  while (i < loopEnd) {
    while (j < loopEnd) {
      if (isRandomlyAlive()) {
        const key = getKey({ x: i, y: j }, bits);

        pieces[key] = createPiece(key, bits, true);
      }

      j += dummyPiece.size.height;
    }
    i += dummyPiece.size.width;
    j = loopStart;
  }

  return {
    pieces,
    updates: { clear: [], draw: Object.values(pieces) },
    opts: { bits }
  }
}
export const getBits = (maxPosition) =>
  Math.ceil(Math.log2(maxPosition + 1));

export const getMaxPosition = (bits) =>
  Math.pow(2, bits) - 1

export const getKey = function ({ x, y }, bits) {
  const maxPosition = getMaxPosition(bits);

  if (x < 0 || x > maxPosition || y < 0 || y > maxPosition)
    return undefined;

  return (y << bits) | x;
};

const randomInt = max => Math.floor(Math.random() * max);
export const pickRandom = (arr = []) => arr[randomInt(arr.length)];

export const createPiece = (key, bits, isAlive = false) => ({
  isAlive,
  key,
  color: pickRandom(PIECE_COLORS),
  position: {
    x: key & getMaxPosition(bits),
    y: key >> bits,
  },
  size: { width: 4, height: 4 }
});

export const getPieceKey = ({ position }, bits) =>
  getKey(position, bits);

const transpose = ({ x, y }, xOffset, yOffset) => ({
  x: x + xOffset,
  y: y + yOffset
});

export const getNeighborKeys = ({ position, size }, bits) => ([
  getKey(transpose(position, -1 * size.width, -1 * size.height), bits),
  getKey(transpose(position,               0, -1 * size.height), bits),
  getKey(transpose(position,      size.width, -1 * size.height), bits),
  getKey(transpose(position, -1 * size.width,                0), bits),
  getKey(transpose(position,      size.width,                0), bits),
  getKey(transpose(position, -1 * size.width,      size.height), bits),
  getKey(transpose(position,               0,      size.height), bits),
  getKey(transpose(position,      size.width,      size.height), bits),
].filter(x => x !== undefined));

const getAliveNeighbors = (pieces, opts, piece) =>
  getNeighborKeys(piece, opts.bits).filter(function (key) {
    const piece = pieces[key];

    return piece && piece.isAlive;
  });

export const willPieceBeAlive = function (pieces, opts, piece) {
  const neighborCount = getAliveNeighbors(pieces, opts, piece).length;

  return (
    (piece.isAlive && (neighborCount === 2 || neighborCount === 3)) ||
    (!piece.isAlive && neighborCount === 3)
  );
};

const canBeDrawn = function ({ position }, bits) {
  return (
    position.x >= 0 && position.x < getMaxPosition(bits) &&
    position.y >= 0 && position.y < getMaxPosition(bits) 
  );
};

export const process = function (previous, opts) {
  let clear, draw = [];
  const next = { ...previous };

  Object.keys(next).forEach(function (pk) {
    const piece = next[pk];

    getNeighborKeys(piece, opts.bits).forEach(function (key) {
      if (next[key]) return;
      next[key] = createPiece(key, opts.bits);
    });
  });

  const deadPieces = Object.keys(next).filter(function (pk) {
    return !willPieceBeAlive(next, opts, next[pk]);
  });

  clear = deadPieces.filter(function (pk) {
    return next[pk].isAlive && canBeDrawn(next[pk], opts.bits);
  }).map(pk => ({ ...next[pk] }));

  deadPieces.forEach(function (pk) {
    delete next[pk];
  });

  Object.keys(next).forEach(function (pk) {
    if (!next[pk].isAlive && canBeDrawn(next[pk], opts.bits))
      draw.push(next[pk]);

    next[pk].isAlive = true
  });

  return { clear, draw, pieces: next };
};
