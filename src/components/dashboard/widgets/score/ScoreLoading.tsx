
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ScoreLoading = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Score</CardTitle>
        <CardDescription>Loading your performance data...</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-40">
        <div className="animate-pulse flex flex-col items-center">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-2 w-24 rounded mb-2" />
          <Skeleton className="h-2 w-16 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreLoading;
