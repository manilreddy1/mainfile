
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RatingStars } from "@/components/ui/rating-stars";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Rating {
  id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  student_name?: string;
}

interface TeacherRatingsProps {
  teacherId: string;
}

const TeacherRatings = ({ teacherId }: TeacherRatingsProps) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        
        // Get the average rating
        const { data: avgData } = await supabase.rpc(
          'get_teacher_average_rating',
          { teacher_uuid: teacherId }
        );
        
        setAverageRating(Number(avgData) || 0);
        
        // Get actual ratings
        const { data: ratingsData, error } = await supabase
          .from('teacher_ratings')
          .select(`
            id,
            rating,
            feedback,
            created_at,
            student_id,
            profiles!student_id(first_name, last_name)
          `)
          .eq('teacher_id', teacherId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (ratingsData) {
          const formattedRatings = ratingsData.map(item => ({
            id: item.id,
            rating: item.rating,
            feedback: item.feedback,
            created_at: item.created_at,
            student_name: item.profiles ? 
              `${item.profiles.first_name?.charAt(0) || ''}. ${item.profiles.last_name || 'Student'}` : 
              'Anonymous Student'
          }));
          
          setRatings(formattedRatings);
          setTotalRatings(formattedRatings.length);
        }
      } catch (error) {
        console.error("Error fetching teacher ratings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (teacherId) {
      fetchRatings();
    }
  }, [teacherId]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
        ))}
      </div>
    );
  }
  
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No ratings available yet</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RatingStars rating={averageRating} />
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {ratings.map(review => (
          <Card key={review.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{review.student_name}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center">
                <RatingStars rating={review.rating} size="sm" />
              </div>
            </div>
            {review.feedback && (
              <p className="mt-2 text-gray-700">{review.feedback}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherRatings;
