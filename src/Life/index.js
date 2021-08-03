import { GAME_BITS } from './constants';
import { greedy } from './heuristics';
import Game, { withGameUpdates } from './Game';
export { Game, withGameUpdates };

export { buildInitialState } from './Intelligent';

export const opts = {
  bits: GAME_BITS,
  heuristic: greedy,
  sampleSize: 4096,
  executionIterations: 64
};

export default Game;
