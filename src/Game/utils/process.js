import { createPiece } from './factory';
import { getKey, getMaxPosition, transpose } from './position';

export const clearBoard = function (pieces) {
  return { draw: [], clear: Object.values(pieces), pieces: {} };
};

const getNeighborKeys = ({ position, size }, bits) => ([
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

const willPieceBeAlive = function (pieces, opts, piece) {
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
