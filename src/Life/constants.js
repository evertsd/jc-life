import Colors from '../colors';

const BOARD_EDGE = 20;
export const BOARD = { height: BOARD_EDGE, width: BOARD_EDGE };
export const PIECE_COLORS = [Colors.SILVER, Colors.RED, Colors.GREEN, Colors.GOLD];

export const MS_PER_ITERATION = 250;
// DO NOT EXCEED (32768 - BOARD_EDGE).
export const MAX_ITERATIONS = 100
export const PIECE_SIZE = { height: 1, width: 1 };
