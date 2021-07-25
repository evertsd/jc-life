import { BOARD_EDGE } from '../constants';
import * as util from '../util';

export const buildInitialState = function (bits) {
  const pieces = {};
  const loopStart = (util.getMaxPosition(bits) - BOARD_EDGE) / 2;
  const loopEnd = loopStart + BOARD_EDGE;
  const dummyPiece = util.createPiece(0, bits);

  let i = loopStart, j = loopStart;

  while (i < loopEnd) {
    while (j < loopEnd) {
      if (util.isRandomlyAlive()) {
        const key = util.getKey({ x: i, y: j }, bits);

        pieces[key] = util.createPiece(key, bits, true);
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

const canBeDrawn = function ({ position }, bits) {
  return (
    position.x >= 0 && position.x < util.getMaxPosition(bits) &&
    position.y >= 0 && position.y < util.getMaxPosition(bits)
  );
};

export const process = function (previous, opts) {
  let clear, draw = [];
  const next = { ...previous };

  Object.keys(next).forEach(function (pk) {
    const piece = next[pk];

    util.getNeighborKeys(piece, opts.bits).forEach(function (key) {
      if (next[key]) return;
      next[key] = util.createPiece(key, opts.bits);
    });
  });

  const deadPieces = Object.keys(next).filter(function (pk) {
    return !util.willPieceBeAlive(next, opts, next[pk]);
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