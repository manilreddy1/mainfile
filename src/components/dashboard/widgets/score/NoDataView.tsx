
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NoDataView = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Score</CardTitle>
        <CardDescription>Your performance tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
          <h3 className="font-medium text-lg mb-1">No Performance Data Yet</h3>
          <p className="text-gray-500 mb-4">
            Enroll in classes to start tracking your performance
          </p>
          <Button asChild>
            <Link to="/academics">Browse Available Classes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDataView;
