import { GREYS} from '../colors';

export const GAME_BITS = 9;
export const BOARD_EDGE = Math.pow(2, 5);
export const BOARD = { height: BOARD_EDGE, width: BOARD_EDGE };
export const PIECE_COLORS = Object.values(GREYS);

export const MS_PER_ITERATION = 250;
// DO NOT EXCEED (32768 - BOARD_EDGE).
export const MAX_ITERATIONS = 100
export const PIECE_SIZE = { height: 1, width: 1 };
