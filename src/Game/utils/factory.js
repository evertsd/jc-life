import { getMaxPosition } from './position';
import { GREYS } from '../../colors';

export const PIECE_COLORS = Object.values(GREYS);

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
