export const getMaxPosition = (bits) =>
  Math.pow(2, bits) - 1;

export const getKey = function ({ x, y }, bits) {
  const maxPosition = getMaxPosition(bits);

  if (x < 0 || x > maxPosition || y < 0 || y > maxPosition)
    return undefined;

  return (y << bits) | x;
};

export const transpose = function ({ x, y }, xOffset, yOffset) {
  const calculateX = typeof xOffset === 'function' ? xOffset : (x) => x + xOffset;
  const calculateY = typeof yOffset === 'function' ? yOffset : (y) => y + yOffset;

  return {
    x: calculateX(x),
    y: calculateY(y)
  };
}
