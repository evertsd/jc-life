import { BOARD_EDGE } from '../constants';
import * as util from '../util';

const createRandomBoard = function (bits) {
  const pieces = {};
  const loopStart = (util.getMaxPosition(bits) - BOARD_EDGE) / 2;
  const loopEnd = loopStart + BOARD_EDGE;
  const dummyPiece = util.createPiece(0, bits);
  const aliveThreshold = Math.random();

  let i = loopStart, j = loopStart;

  while (i < loopEnd) {
    while (j < loopEnd) {
      if (util.isRandomlyAlive(aliveThreshold)) {
        const key = util.getKey({ x: i, y: j }, bits);

        pieces[key] = util.createPiece(key, bits, true);
      }

      j += dummyPiece.size.height;
    }
    i += dummyPiece.size.width;
    j = loopStart;
  }

  return pieces;
};

const simulateExecution = function (heuristic, opts) {
  const manager = heuristic.createArtifactManager(opts.executionIterations);
  let board = createRandomBoard(opts.bits);
  let continueProcessing = manager.processIteration(board);

  while (continueProcessing) {
    board = util.process(board, opts).pieces;
    continueProcessing = manager.processIteration(board);
  }

  return manager.getArtifact();
};

const isNewMaxima = function (artifact, { score, iterationsPerformed, iterationLimit }) {
  const useScoreOnly = true;

  return useScoreOnly ?
    (artifact.score > score) : (
    (artifact.score * (artifact.iterationsPerformed / artifact.iterationLimit)) >
    (score * (iterationsPerformed / iterationLimit))
  );
};

const findGreedyMaxima = function (heuristic, opts) {
  let samplesComplete = 0;
  let artifact = heuristic.createEmptyArtifact();
  let maxima = artifact;

  while (artifact.iterationsPerformed < 64 && samplesComplete < opts.sampleSize) {
    samplesComplete++
    artifact = simulateExecution(heuristic, opts);

    if (artifact.iterationsPerformed > 63 || isNewMaxima(artifact, maxima))
      maxima = artifact;
  }

  console.info('findLocalMaxima, maxima, samples', maxima);
  window.localMaxima = { ...opts, ...maxima };
  return maxima.initialBoard;
};

const findLocalMaxima = function (heuristic, opts) {
  const artifacts = Array.from({ length: opts.sampleSize }, () => simulateExecution(heuristic, opts));

  const maxima = artifacts.reduce(function (maxima, artifact) {
    if (artifact.score < maxima.score)
      return maxima;

    return artifact;
  },  heuristic.createEmptyArtifact());

  console.info('findLocalMaxima, maxima, samples', maxima.score);
  window.localMaxima = { ...opts, ...maxima };
  return maxima.initialBoard;
};

export const buildInitialState = function ({ heuristic, ...opts }) {
  console.time('findLocalMaxima');
  const keys = findGreedyMaxima(heuristic, opts);
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
};
