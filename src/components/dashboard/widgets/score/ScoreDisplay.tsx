
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getScoreColor, getProgressColor, formatDate } from "./utils";

interface ScoreDisplayProps {
  score: number;
  lastUpdated: string | null;
}

const ScoreDisplay = ({ score, lastUpdated }: ScoreDisplayProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Score</CardTitle>
        <CardDescription>Your current performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <span className="absolute -right-4 text-lg font-bold top-0">%</span>
          </div>
        </div>
        <Progress value={score || 0} className="h-2 mb-2" 
          style={{ 
            "--progress-background": getProgressColor(score)
          } as React.CSSProperties} 
        />
        <div className="grid grid-cols-3 text-xs text-center">
          <div className="text-red-500">Needs Work</div>
          <div className="text-amber-500">Good</div>
          <div className="text-green-500">Excellent</div>
        </div>
        {lastUpdated && (
          <div className="text-xs text-gray-500 text-center mt-2">
            Last updated: {formatDate(lastUpdated)}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/dashboard?tab=performance" className="text-blue-600 text-sm flex items-center">
          Performance details <ChevronRight size={16} />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ScoreDisplay;
