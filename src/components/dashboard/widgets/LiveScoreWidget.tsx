
import React from "react";
import ScoreLoading from "./score/ScoreLoading";
import NoDataView from "./score/NoDataView";
import NoScoresView from "./score/NoScoresView";
import ScoreDisplay from "./score/ScoreDisplay";
import { useScoreData } from "./score/useScoreData";

const LiveScoreWidget = () => {
  const { loading, hasData, score, lastUpdated } = useScoreData();

  if (loading) {
    return <ScoreLoading />;
  }

  // Show message for new students with no data
  if (!hasData) {
    return <NoDataView />;
  }

  // No score yet, but student is enrolled
  if (hasData && score === null) {
    return <NoScoresView />;
  }

  // Show actual score data
  return <ScoreDisplay score={score as number} lastUpdated={lastUpdated} />;
};

export default LiveScoreWidget;
