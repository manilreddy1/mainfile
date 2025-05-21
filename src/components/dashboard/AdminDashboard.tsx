import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ChevronRight, FileText, GraduationCap, Settings, ShieldCheck, User, UserCircle, Users } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="container-custom py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Administrator</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings size={18} />
              Settings
            </Button>
          </Link>
          <Button 
            onClick={() => {
              localStorage.removeItem("userType");
              window.location.href = "/login";
            }}
            variant="ghost" 
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
                <CardDescription>Platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,253</p>
                <div className="flex items-center text-sm mt-2 text-green-600">
                  <span>+12% from last month</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="#" className="text-blue-600 text-sm flex items-center">
                  Manage users <ChevronRight size={16} />
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Courses</CardTitle>
                <CardDescription>Currently running</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">76</p>
                <div className="flex items-center text-sm mt-2 text-green-600">
                  <span>+8% from last month</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="#" className="text-blue-600 text-sm flex items-center">
                  Manage courses <ChevronRight size={16} />
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Health</CardTitle>
                <CardDescription>Platform status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <p className="font-medium">All Systems Operational</p>
                </div>
                <div className="flex items-center text-sm mt-2 text-gray-500">
                  <span>Last checked: 5 minutes ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="#" className="text-blue-600 text-sm flex items-center">
                  View system status <ChevronRight size={16} />
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown of user types on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Students</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Teachers</span>
                    <span className="text-sm font-medium">24%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Administrators</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest activities on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New User Registration</p>
                    <p className="text-sm text-gray-500">John Doe registered as a Student</p>
                    <p className="text-xs text-gray-400">10 minutes ago</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-green-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    <FileText size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Course Created</p>
                    <p className="text-sm text-gray-500">Dr. Smith created "Advanced Data Structures"</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    <BarChart3 size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">System Report Generated</p>
                    <p className="text-sm text-gray-500">Monthly usage report for June</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Add New User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                      <UserCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Alice Johnson</p>
                      <p className="text-sm text-gray-500">Student • Joined 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                      <UserCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Professor Smith</p>
                      <p className="text-sm text-gray-500">Teacher • Joined 1 year ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                      <UserCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Mike Brown</p>
                      <p className="text-sm text-gray-500">Admin • Joined 2 years ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                      <UserCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Sara Lee</p>
                      <p className="text-sm text-gray-500">Student • Joined 1 month ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage all courses</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Add New Course</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Advanced Mathematics</h3>
                      <p className="text-sm text-gray-500">Prof. Johnson • 28 students</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Introduction to Computer Science</h3>
                      <p className="text-sm text-gray-500">Prof. Williams • 45 students</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Modern Literature</h3>
                      <p className="text-sm text-gray-500">Prof. Adams • 32 students</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Physics 101</h3>
                      <p className="text-sm text-gray-500">Prof. Thomas • 38 students</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>Platform usage and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">User Growth (Last 6 Months)</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
                    <div className="w-1/6 px-2">
                      <div className="h-[40%] bg-blue-500 rounded-t-md"></div>
                      <p className="text-xs text-center mt-2">Jan</p>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[50%] bg-blue-500 rounded-t-md"></div>
                      <p className="text-xs text-center mt-2">Feb</p>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[65%] bg-blue-500 rounded-t-md"></div>
                      <p className="text-xs text-center mt-2">Mar</p>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[55%] bg-blue-500 rounded-t-md"></div>
                      <p className="text-xs text-center mt-2">Apr</p>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[75%] bg-blue-500 rounded-t-md"></div>
                      <p className="text-xs text-center mt-2">May</p>
                    </div>
                    <div className="w-1/6 px-2">
                      <div className="h-[90%] bg-blue-500 rounded-t-md"></div>
                      <p className="text-xs text-center mt-2">Jun</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Most Active Courses</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Intro to Programming</span>
                        <span className="font-medium">89 students</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Data Structures</span>
                        <span className="font-medium">76 students</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Web Development</span>
                        <span className="font-medium">68 students</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">User Engagement</h3>
                    <div className="flex justify-between mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">87%</p>
                        <p className="text-sm text-gray-500">Course Completion</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">92%</p>
                        <p className="text-sm text-gray-500">Login Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">73%</p>
                        <p className="text-sm text-gray-500">Material Usage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Download Full Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Manage platform configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Take the platform offline for maintenance</p>
                    </div>
                    <Button variant="outline" size="sm">Deactivated</Button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">User Registration</h3>
                      <p className="text-sm text-gray-500">Allow new users to register</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700" size="sm">Enabled</Button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">System Backup</h3>
                      <p className="text-sm text-gray-500">Last backup: June 15, 2023</p>
                    </div>
                    <Button variant="outline" size="sm">Run Backup</Button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Send automatic emails to users</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700" size="sm">Enabled</Button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Security Audit</h3>
                      <p className="text-sm text-gray-500">Last audit: May 20, 2023</p>
                    </div>
                    <Button variant="outline" size="sm">Run Audit</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AdminDashboard;
