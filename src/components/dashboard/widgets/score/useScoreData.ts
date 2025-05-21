
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ScoreData {
  hasData: boolean;
  score: number | null;
  lastUpdated: string | null;
  loading: boolean;
}

export const useScoreData = (): ScoreData => {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    // Only fetch data if we have an authenticated user
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStudentScores = async () => {
      try {
        // Check if the student has any scores
        const { data: scoreData, error: scoreError } = await supabase
          .from('student_scores')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
            
        if (scoreError) {
          console.error("Error fetching scores:", scoreError);
          setHasData(false);
        } else if (scoreData && scoreData.length > 0) {
          // We have score data
          setHasData(true);
          setScore(scoreData[0].score);
          setLastUpdated(scoreData[0].created_at);
        } else {
          // Check if the student is enrolled in any courses
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', user.id)
            .eq('status', 'active')
            .limit(1);
              
          if (enrollmentError) {
            console.error("Error fetching enrollments:", enrollmentError);
            setHasData(false);
          } else if (enrollmentData && enrollmentData.length > 0) {
            // Student is enrolled but has no scores yet
            setHasData(true);
            setScore(null); // No scores yet
          } else {
            // Student is not enrolled in any courses
            setHasData(false);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Could not load performance data",
          variant: "destructive",
        });
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentScores();
  }, [user]);
  
  return { loading, hasData, score, lastUpdated };
};
