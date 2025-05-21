
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  totalStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export const RatingStars = ({
  rating,
  totalStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  readOnly = true
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);
  
  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const handleClick = (index: number) => {
    if (interactive && !readOnly) {
      const newRating = index + 1;
      setSelectedRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (interactive && !readOnly) {
      setHoverRating(index + 1);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  const getSizeClass = () => {
    switch(size) {
      case "sm": return "h-3 w-3";
      case "lg": return "h-6 w-6";
      default: return "h-5 w-5";
    }
  };

  return (
    <div className="flex gap-1 items-center">
      {[...Array(totalStars)].map((_, index) => {
        const displayRating = hoverRating || selectedRating;
        const filled = index < displayRating;
        
        return (
          <Star
            key={index}
            className={cn(
              getSizeClass(),
              "transition-colors",
              filled ? "fill-amber-500 text-amber-500" : "fill-transparent text-gray-300",
              interactive && !readOnly && "cursor-pointer"
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};
