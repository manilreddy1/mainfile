
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { PieChart, Download } from "lucide-react";

interface PerformanceWidgetProps {
  detailed?: boolean;
}

const PerformanceWidget = ({ detailed = false }: PerformanceWidgetProps) => {
  // Mock performance data
  const performanceData = [
    { month: 'Jan', score: 78, attendance: 92, participation: 65 },
    { month: 'Feb', score: 82, attendance: 94, participation: 70 },
    { month: 'Mar', score: 85, attendance: 90, participation: 85 },
    { month: 'Apr', score: 78, attendance: 91, participation: 80 },
  ];
  
  // Mock subject performance data
  const subjectData = [
    { subject: 'Math', score: 85, assignments: 95, participation: 75, tests: 80 },
    { subject: 'Science', score: 78, assignments: 82, participation: 70, tests: 75 },
    { subject: 'Literature', score: 92, assignments: 90, participation: 95, tests: 90 },
    { subject: 'History', score: 75, assignments: 70, participation: 80, tests: 72 },
    { subject: 'Language', score: 88, assignments: 85, participation: 90, tests: 88 },
  ];
  
  // Mock attendance data
  const attendanceData = [
    { class: 'Math', attended: 18, total: 20 },
    { class: 'Science', attended: 17, total: 18 },
    { class: 'Literature', attended: 15, total: 16 },
    { class: 'History', attended: 14, total: 15 },
    { class: 'Language', attended: 19, total: 20 },
  ];
  
  // Calculate overall attendance percentage
  const overallAttendance = attendanceData.reduce((acc, curr) => acc + curr.attended, 0) / 
    attendanceData.reduce((acc, curr) => acc + curr.total, 0) * 100;

  return (
    <>
      {!detailed ? (
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your academic progress and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                score: { label: "Score", color: "#2563eb" },
                attendance: { label: "Attendance", color: "#16a34a" },
                participation: { label: "Participation", color: "#ca8a04" }
              }} 
              className="aspect-[4/3]"
            >
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--color-score)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="var(--color-attendance)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="participation" 
                  stroke="var(--color-participation)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="w-full">View Detailed Performance</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Detailed Performance Analytics</CardTitle>
                <CardDescription>In-depth analysis of your academic progress</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={14} /> Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subjects">By Subject</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="improvement">Improvement Areas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-4">Performance Trends</h3>
                  <ChartContainer 
                    config={{
                      score: { label: "Score", color: "#2563eb" },
                      attendance: { label: "Attendance", color: "#16a34a" },
                      participation: { label: "Participation", color: "#ca8a04" }
                    }} 
                    className="aspect-[4/3]"
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="var(--color-score)" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="var(--color-attendance)" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="participation" 
                        stroke="var(--color-participation)" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600 text-center">83%</div>
                      <p className="text-center text-sm text-gray-500">
                        7% increase from last semester
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-green-600 text-center">92%</div>
                      <p className="text-center text-sm text-gray-500">
                        Above class average by 5%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Participation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-amber-600 text-center">75%</div>
                      <p className="text-center text-sm text-gray-500">
                        Area for potential improvement
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-4">Key Insights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                        <PieChart size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Strong improvement in Literature</p>
                        <p className="text-sm text-gray-500">Your essay writing skills have shown significant progress</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                        <PieChart size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Participation trends are positive</p>
                        <p className="text-sm text-gray-500">You've been more active in discussions over the past month</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                        <PieChart size={14} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Focus area: Math problem-solving</p>
                        <p className="text-sm text-gray-500">Consider scheduling additional tutoring sessions</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="subjects">
                <h3 className="text-md font-medium mb-4">Performance by Subject</h3>
                <ChartContainer 
                  config={{
                    score: { label: "Overall Score", color: "#2563eb" },
                    assignments: { label: "Assignments", color: "#16a34a" },
                    participation: { label: "Participation", color: "#ca8a04" },
                    tests: { label: "Tests", color: "#dc2626" },
                  }}
                  className="aspect-[4/3] mb-6"
                >
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="score" fill="var(--color-score)" />
                    <Bar dataKey="assignments" fill="var(--color-assignments)" />
                    <Bar dataKey="participation" fill="var(--color-participation)" />
                    <Bar dataKey="tests" fill="var(--color-tests)" />
                  </BarChart>
                </ChartContainer>
                
                <div className="space-y-4">
                  {subjectData.map((subject) => (
                    <div key={subject.subject} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{subject.subject}</h4>
                        <div className="text-lg font-bold">{subject.score}%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Assignments</span>
                          <span className="text-sm font-medium">{subject.assignments}%</span>
                        </div>
                        <Progress value={subject.assignments} className="h-1.5" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Participation</span>
                          <span className="text-sm font-medium">{subject.participation}%</span>
                        </div>
                        <Progress value={subject.participation} className="h-1.5" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Tests</span>
                          <span className="text-sm font-medium">{subject.tests}%</span>
                        </div>
                        <Progress value={subject.tests} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="attendance">
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Overall Attendance</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{Math.round(overallAttendance)}%</span>
                        <span className="text-sm text-gray-500">Target: 95%</span>
                      </div>
                      <Progress value={overallAttendance} className="h-2.5" />
                    </div>
                    <div className="text-lg font-bold text-right text-blue-600 min-w-[80px]">
                      {Math.round(overallAttendance)}%
                    </div>
                  </div>
                </div>
                
                <h3 className="text-md font-medium mb-4">Attendance by Class</h3>
                <div className="space-y-4">
                  {attendanceData.map((item) => (
                    <div key={item.class} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{item.class}</h4>
                        <div className="text-gray-500 text-sm">
                          {item.attended} of {item.total} classes
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500"></span>
                        <span className="text-sm font-medium">
                          {Math.round((item.attended / item.total) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(item.attended / item.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="improvement">
                <h3 className="text-md font-medium mb-4">Suggested Improvement Areas</h3>
                <div className="space-y-6">
                  <div className="border p-4 rounded-lg bg-amber-50 border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">Mathematics: Problem Solving</h4>
                    <p className="text-sm text-amber-700 mb-3">
                      Based on your recent quiz results, you may benefit from additional practice with
                      algebraic equation solving and word problems.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="bg-white">Schedule Tutoring</Button>
                      <Button size="sm" variant="outline" className="bg-white">Practice Problems</Button>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg bg-amber-50 border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">History: Essay Structure</h4>
                    <p className="text-sm text-amber-700 mb-3">
                      Your historical knowledge is strong, but structuring arguments in essays could be improved 
                      with better organization and more primary sources.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="bg-white">Writing Resources</Button>
                      <Button size="sm" variant="outline" className="bg-white">Essay Templates</Button>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg bg-green-50 border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Literature: Advanced Analysis</h4>
                    <p className="text-sm text-green-700 mb-3">
                      You're performing well in literature. To reach excellence, consider exploring 
                      more advanced literary criticism techniques.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="bg-white">Advanced Readings</Button>
                      <Button size="sm" variant="outline" className="bg-white">Analysis Methods</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default PerformanceWidget;
