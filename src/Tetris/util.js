import { BOARD, ORNAMENT_COLORS, ORNAMENT_SIZE } from './constants';

const randomInt = max => Math.floor(Math.random() * max);
export const pickRandom = (arr = []) => arr[randomInt(arr.length)];

export const generateOrnament = () => ({
    position: {
        x: randomInt(BOARD.width) * ORNAMENT_SIZE.width,
        y: 0,
    },
    size: ORNAMENT_SIZE,
    color: pickRandom(ORNAMENT_COLORS),
});

export const getCollision = (columnHeights, { position }) => {
    const column = position.x / ORNAMENT_SIZE.width;
    const ornamentHeight = (position.y / ORNAMENT_SIZE.height) + 1;

    if ((BOARD.height - columnHeights[column]) <= ornamentHeight) {
        return [
            ...columnHeights.slice(0, column),
            columnHeights[column] + 1,
            ...columnHeights.slice(column + 1, columnHeights.length),
        ];
    }
}
