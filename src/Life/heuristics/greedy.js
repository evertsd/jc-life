const getScore = function (initialNodeCount, finalNodeCount) {
  return (initialNodeCount === 0 || finalNodeCount === 0) ? 0 :
    finalNodeCount / initialNodeCount;
};

const isHealthyArtifact = function ({ currentNodeCount, initialNodeCount, iterationsPerformed, iterationLimit }) {
  const percentComplete = iterationsPerformed / iterationLimit;

  return (
    iterationsPerformed < iterationLimit &&
    // (score > (21/32 * Math.sqrt(iterationsPerformed)))
    // score > (iterationsPerformed / 16)
    currentNodeCount > (initialNodeCount / (16 - 2 * percentComplete) * iterationsPerformed)
  );
};

const getUnhealthyStreakLimit = function ({ iterationLimit, iterationsPerformed }) {
  return Math.floor(Math.sqrt(iterationLimit)) - Math.floor(Math.sqrt(iterationsPerformed));
};

export const calculateArtifactScore = function ({ initialNodeCount, currentNodeCount }) {
  return (initialNodeCount === 0 || currentNodeCount === 0) ? 0 :
    currentNodeCount / initialNodeCount;
};

export const createEmptyArtifact = (iterationLimit = 0) => ({
  initialBoard: [],
  initialNodeCount: 0,
  currentNodeCount: 0,
  finalNodeCount: 0,
  score: 0,
  iterationsPerformed: 0,
  unhealthyStreak: 0,
  iterationLimit
});

export const createArtifactManager = function (iterationLimit) {
  const artifact = createEmptyArtifact(iterationLimit);

  return {
    getArtifact: () => artifact,
    processIteration: function (board) {
      if (artifact.iterationsPerformed === 0) {
        artifact.initialBoard = Object.keys(board);
        artifact.initialNodeCount = artifact.initialBoard.length;
      }

      artifact.currentNodeCount = Object.keys(board).length;
      artifact.score = calculateArtifactScore(artifact);

      const isHealthy = isHealthyArtifact(artifact);

      artifact.unhealthyStreak = isHealthy ? 0 : (
        artifact.unhealthyStreak + 1)

      const continueProcessing = artifact.unhealthyStreak < getUnhealthyStreakLimit(artifact);

      if (!continueProcessing) {
        artifact.finalNodeCount = artifact.currentNodeCount;
      }

      artifact.iterationsPerformed++;

      return continueProcessing;
    }
  }
}
