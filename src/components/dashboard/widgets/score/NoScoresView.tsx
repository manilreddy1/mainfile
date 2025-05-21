
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const NoScoresView = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Score</CardTitle>
        <CardDescription>Your performance tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="h-12 w-12 text-blue-500 mb-3" />
          <h3 className="font-medium text-lg mb-1">No Scores Yet</h3>
          <p className="text-gray-500 mb-4">
            Complete assessments to see your scores here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoScoresView;
