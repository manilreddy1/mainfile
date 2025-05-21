
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Book, Video, Download, Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResourcesWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Fetch enrollments to get course IDs
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id)
          .eq('status', 'active');
          
        if (enrollError) throw enrollError;
        
        if (enrollments && enrollments.length > 0) {
          // Fetch course information for these enrollments
          const courseIds = enrollments.map(e => e.course_id);
          const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .in('id', courseIds);
            
          if (coursesError) throw coursesError;
          
          if (courses && courses.length > 0) {
            // Transform course data into resources
            const resourceData = courses.map(course => ({
              id: course.id,
              title: `${course.title} Materials`,
              type: course.subject.toLowerCase().includes('math') ? 'book' : 
                    course.subject.toLowerCase().includes('science') ? 'interactive' : 
                    course.subject.toLowerCase().includes('history') ? 'video' : 'pdf',
              subject: course.subject,
              description: course.description || `Learning materials for ${course.title}`,
              date: `Updated ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
              downloadable: Math.random() > 0.5, // Random for demo purposes
            }));
            
            setResources(resourceData);
          }
          
          // Get scores/assessments as assignments
          const { data: scores, error: scoresError } = await supabase
            .from('student_scores')
            .select(`
              id, score, assessment_type, created_at, feedback,
              courses:course_id (title, subject)
            `)
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });
            
          if (scoresError) throw scoresError;
          
          if (scores && scores.length > 0) {
            // Transform scores data into assignments
            const assignmentData = scores.map((score, index) => {
              // Generate due dates (for demo purposes - in production this would come from an assignments table)
              const completed = Math.random() > 0.7;
              const statusOpts = ['completed', 'in-progress', 'pending', 'not-started'];
              const status = completed ? 'completed' : statusOpts[Math.floor(Math.random() * 3) + 1];
              
              return {
                id: score.id,
                title: `${score.assessment_type} - ${score.courses?.title || 'Course Assessment'}`,
                subject: score.courses?.subject || 'General',
                dueDate: `${new Date().getMonth() + 1}/${new Date().getDate() + index + 5}/${new Date().getFullYear()}`,
                status: status,
                grade: completed ? score.score : undefined,
                feedback: completed ? score.feedback : undefined
              };
            });
            
            setAssignments(assignmentData);
          }
        } else {
          // Empty state - no enrollments
          setResources([]);
          setAssignments([]);
        }
      } catch (error) {
        console.error("Error fetching resources data:", error);
        toast({
          title: "Error",
          description: "Could not load resources data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter resources based on search query
  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get resource icon based on type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book size={16} className="text-blue-600" />;
      case 'video':
        return <Video size={16} className="text-red-600" />;
      case 'interactive':
        return <BookOpen size={16} className="text-green-600" />;
      default:
        return <FileText size={16} className="text-amber-600" />;
    }
  };
  
  // Get assignment status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Completed</span>;
      case 'in-progress':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">In Progress</span>;
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Not Started</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resources & Assignments</CardTitle>
          <CardDescription>Loading your materials...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources & Assignments</CardTitle>
        <CardDescription>Learning materials and coursework</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resources">
          <TabsList className="mb-4">
            <TabsTrigger value="resources">Study Materials</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources by title or subject"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No resources found</p>
                  {searchQuery ? 
                    <p className="text-sm mt-1">Try a different search term</p> :
                    <p className="text-sm mt-1">Enroll in courses to access learning materials</p>
                  }
                </div>
              ) : (
                filteredResources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-gray-100 p-2 rounded-full h-10 w-10 flex items-center justify-center mt-1">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-gray-500">{resource.subject}</p>
                          <p className="text-xs text-gray-400 mt-1">{resource.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{resource.date}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm">View</Button>
                        {resource.downloadable && (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download size={14} /> Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assignments">
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No assignments found</p>
                  <p className="text-sm mt-1">Your assignments will appear here once they're assigned</p>
                </div>
              ) : (
                assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-amber-100 p-2 rounded-full h-10 w-10 flex items-center justify-center mt-1">
                          <FileText size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-gray-500">{assignment.subject}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Due: {assignment.dueDate}
                          </p>
                          {assignment.feedback && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs">
                              <p className="font-medium">Feedback: {assignment.grade}%</p>
                              <p>{assignment.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(assignment.status)}
                        {assignment.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant={assignment.status === 'not-started' ? 'outline' : 'default'}
                          >
                            {assignment.status === 'not-started' 
                              ? 'Start' 
                              : assignment.status === 'in-progress' 
                                ? 'Continue' 
                                : 'Submit'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Request Materials</Button>
        <Button>Browse Course Catalog</Button>
      </CardFooter>
    </Card>
  );
};

export default ResourcesWidget;
