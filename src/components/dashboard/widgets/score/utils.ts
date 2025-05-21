
// Score utility functions

/**
 * Determine score color based on value
 */
export const getScoreColor = (score: number | null) => {
  if (score === null) return "text-gray-500";
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
};

/**
 * Determine progress color based on value
 */
export const getProgressColor = (score: number | null) => {
  if (score === null) return "bg-gray-400";
  if (score >= 90) return "bg-green-600";
  if (score >= 80) return "bg-blue-600";
  if (score >= 70) return "bg-amber-600";
  return "bg-red-600";
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};
