
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { RatingStars } from "@/components/ui/rating-stars";
import { supabase } from "@/integrations/supabase/client";

interface SessionRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  studentId: string;
  sessionId: string;
  teacherName: string;
}

const SessionRatingModal = ({ 
  isOpen, 
  onClose, 
  teacherId, 
  studentId, 
  sessionId, 
  teacherName 
}: SessionRatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('teacher_ratings')
        .insert({
          teacher_id: teacherId,
          student_id: studentId,
          session_id: sessionId,
          rating,
          feedback: feedback.trim() || null
        });
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already rated",
            description: "You have already submitted a rating for this session",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Rating submitted",
          description: "Thank you for your feedback!",
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate your session with {teacherName}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-600">How would you rate your experience?</p>
            
            <RatingStars 
              rating={rating}
              interactive={true}
              readOnly={false}
              size="lg"
              onRatingChange={setRating}
            />
            
            <div className="w-full mt-4">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                Additional feedback (optional)
              </label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about the session..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || rating === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRatingModal;
