export const getBits = (maxPosition) =>
  Math.ceil(Math.log2(maxPosition + 1));

export const getMaxPosition = (bits) =>
  Math.pow(2, bits) - 1

export const getKey = function (x, y, bits) {
  const maxPosition = getMaxPosition(bits);

  if (x < 0 || x > maxPosition || y < 0 || y > maxPosition)
    throw new Error(`Attempting to getKey of piece with invalid position ${x},${y}`);

  return (y << bits) | x;
};

export const createDeadPiece = (key, bits) => ({
  isAlive: false,
  key,
  x: key & getMaxPosition(bits),
  y: key >> bits
});

export const getPieceKey = (piece, bits) =>
  getKey(piece.x, piece.y, bits);

export const getNeighborKeys = (piece, bits) => [
  getKey(piece.x - 1, piece.y - 1, bits),
  getKey(piece.x,     piece.y - 1, bits),
  getKey(piece.x + 1, piece.y - 1, bits),
  getKey(piece.x - 1, piece.y,     bits),
  getKey(piece.x + 1, piece.y,     bits),
  getKey(piece.x - 1, piece.y + 1, bits),
  getKey(piece.x,     piece.y + 1, bits),
  getKey(piece.x + 1, piece.y + 1, bits),
];

const getAliveNeighbors = (board, piece) =>
  getNeighborKeys(piece, board.bits).filter(function (key) {
    const piece = board.pieces[key];

    return piece && piece.isAlive;
  });

export const willPieceBeAlive = function (board, piece) {
  const neighborCount = getAliveNeighbors(board, piece).length;

  return (
    (piece.isAlive && (neighborCount === 2 || neighborCount === 3)) ||
    (!piece.isAlive && neighborCount === 3)
  );
};

export const getNextBoardState = function (board) {
  const nextBoard = { ...board, pieces: { ...board.pieces } };

  Object.keys(nextBoard.pieces).forEach(function (pk) {
    const piece = nextBoard.pieces[pk];

    getNeighborKeys(piece, board.bits).forEach(function (key) {
      if (nextBoard.pieces[key]) return;
      nextBoard.pieces[key] = createDeadPiece(key, board.bits);
    });
  });

  Object.keys(nextBoard.pieces).forEach(function (pk) {

  })

  return { ...board, pieces };
};
