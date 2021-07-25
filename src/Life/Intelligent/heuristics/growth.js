export const calculateArtifactScore = function ({ initialNodeCount, finalNodeCount }) {
  return (initialNodeCount === 0 || finalNodeCount === 0) ? 0 :
    finalNodeCount / initialNodeCount;
};

export const createEmptyArtifact = () => ({
  initialBoard: [],
  initialNodeCount: 0,
  finalNodeCount: 0,
  score: 0
});

export const createArtifactManager = function (iterationLimit) {
  let currentIteration = 0;
  const artifact = createEmptyArtifact();

  return {
    getArtifact: () => artifact,
    processIteration: function (board) {
      if (currentIteration === 0) {
        artifact.initialBoard = Object.keys(board);
        artifact.initialNodeCount = artifact.initialBoard.length;
      }

      const continueProcessing = (++currentIteration < iterationLimit);

      if (!continueProcessing) {
        artifact.finalNodeCount = Object.keys(board).length;
        artifact.score = calculateArtifactScore(artifact);
      }

      return continueProcessing;
    }
  }
}
