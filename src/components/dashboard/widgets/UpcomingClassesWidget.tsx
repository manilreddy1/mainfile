
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { LiveClass } from "@/lib/supabase/types";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const UpcomingClassesWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch classes where the student is enrolled in the course
          const { data: enrollments, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('student_id', user.id)
            .eq('status', 'active');
            
          if (enrollmentError) throw enrollmentError;
          
          if (enrollments && enrollments.length > 0) {
            const courseIds = enrollments.map(e => e.course_id);
            
            // Fetch upcoming classes for these courses
            const now = new Date().toISOString();
            const { data: classSessions, error: classError } = await supabase
              .from('class_sessions')
              .select(`
                id,
                title,
                start_time,
                end_time,
                meeting_link,
                status,
                courses:course_id (
                  instructor_id,
                  profiles:instructor_id (
                    first_name,
                    last_name
                  )
                )
              `)
              .in('course_id', courseIds)
              .gt('start_time', now)
              .order('start_time', { ascending: true })
              .limit(10);
              
            if (classError) throw classError;
            
            // Transform data to match our LiveClass interface
            if (classSessions) {
              const formattedClasses = classSessions.map(session => ({
                id: session.id,
                title: session.title,
                instructor: session.courses?.profiles ? 
                  `${session.courses.profiles.first_name} ${session.courses.profiles.last_name}` : 
                  'Unknown Instructor',
                start_time: session.start_time,
                end_time: session.end_time,
                meeting_link: session.meeting_link,
                // Ensure status is one of the allowed values in the LiveClass type
                status: (session.status === 'scheduled' || session.status === 'live' || session.status === 'completed') 
                  ? session.status as 'scheduled' | 'live' | 'completed'
                  : 'scheduled' // Default to 'scheduled' if status is not one of the allowed values
              }));
              
              setClasses(formattedClasses);
            }
          } else {
            // Student not enrolled in any courses
            setClasses([]);
          }
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        toast({
          title: "Error",
          description: "Could not load your class schedule",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);
  
  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today, ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${timeString}`;
    } else {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeString}`;
    }
  };
  
  // Calculate duration in minutes between start and end time
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    return `${durationMinutes} minutes`;
  };
  
  // Filter classes based on search query
  const filteredClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if a class is happening today
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
          <CardDescription>Your scheduled online sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Live Classes</CardTitle>
        <CardDescription>Your scheduled online sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes or instructors"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <div key={cls.id} className="border rounded-lg p-4 transition-colors hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center mt-1">
                      <Video size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cls.title}</h3>
                      <p className="text-sm text-gray-500">{cls.instructor}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="inline mr-1 h-3 w-3" />
                          {formatDateTime(cls.start_time)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="inline mr-1 h-3 w-3" />
                          {calculateDuration(cls.start_time, cls.end_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={isToday(cls.start_time) ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" : ""}
                    onClick={() => {
                      if (cls.meeting_link && isToday(cls.start_time)) {
                        window.open(cls.meeting_link, '_blank');
                      } else {
                        // Could implement a "add to calendar" function
                        toast({
                          title: "Coming soon",
                          description: "Calendar integration will be available soon",
                        });
                      }
                    }}
                  >
                    {isToday(cls.start_time) ? "Join" : "Add to Calendar"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Video className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>
                {searchQuery.length > 0 
                  ? "No classes match your search" 
                  : "You don't have any upcoming classes"}
              </p>
              {searchQuery.length === 0 && (
                <Button variant="outline" className="mt-4">Browse Available Classes</Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Past Recordings</Button>
        <Button>Browse All Classes</Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingClassesWidget;
