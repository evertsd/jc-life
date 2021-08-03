import { BOARD_EDGE } from '../constants';
import * as util from '../../Game/utils';
import * as arrangement from '../../arrangement/immanentLineClear';
import results from '../../results/greedy/20210802_643.json';

const isFileTest = false;
const getTestKeys = function (bits) {
  if (isFileTest)
    return results.initialBoard;

  const dummyPiece = util.createPiece(0, bits, true)
  const offset = (util.getMaxPosition(bits) - BOARD_EDGE) / 2;

  return arrangement.create(bits, dummyPiece.size, offset, offset);
};

export const buildInitialState = function (opts) {
  console.time('findLocalMaxima');
  const keys = getTestKeys(opts.bits);
  console.timeEnd('findLocalMaxima');
  const pieces = {};

  keys.forEach(key => {
    pieces[key] = util.createPiece(key, opts.bits, true);
  });

  return {
    pieces,
    updates: { clear: [], draw: Object.values(pieces) },
    opts
  };
}
