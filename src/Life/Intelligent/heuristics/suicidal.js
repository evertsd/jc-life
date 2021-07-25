export const calculateScore = function (history) {
  const finalNodeCount = (history[history.length - 1]).length;
  const initialNodeCount = (history[0]).length;

  const score = initialNodeCount / finalNodeCount;

  return score;
};
