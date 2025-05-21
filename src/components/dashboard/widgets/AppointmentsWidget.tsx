
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, User, MessageSquare } from "lucide-react";

const AppointmentsWidget = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      teacher: "Prof. Johnson",
      subject: "Mathematics",
      date: "Apr 5, 2025",
      time: "3:00 PM",
      duration: "30 minutes",
      type: "video"
    },
    {
      id: 2,
      teacher: "Dr. Smith",
      subject: "Literature",
      date: "Apr 7, 2025",
      time: "4:15 PM",
      duration: "45 minutes",
      type: "in-person"
    }
  ];
  
  const pastAppointments = [
    {
      id: 3,
      teacher: "Prof. Brown",
      subject: "Physics",
      date: "Mar 29, 2025",
      time: "2:30 PM",
      duration: "30 minutes",
      type: "video",
      feedback: "Excellent progress in understanding mechanics concepts."
    },
    {
      id: 4,
      teacher: "Dr. Williams",
      subject: "History",
      date: "Mar 22, 2025",
      time: "10:00 AM",
      duration: "60 minutes",
      type: "video",
      feedback: "Good research methods. Need to focus more on primary sources."
    }
  ];
  
  // Available teacher slots
  const availableSlots = [
    {
      id: 1,
      teacher: "Prof. Johnson",
      subject: "Mathematics",
      availableDates: [
        { date: "Apr 6, 2025", slots: ["10:00 AM", "1:30 PM", "4:00 PM"] },
        { date: "Apr 8, 2025", slots: ["9:00 AM", "11:30 AM"] }
      ]
    },
    {
      id: 2,
      teacher: "Dr. Smith",
      subject: "Literature",
      availableDates: [
        { date: "Apr 9, 2025", slots: ["2:00 PM", "3:30 PM"] },
        { date: "Apr 10, 2025", slots: ["10:30 AM", "1:00 PM"] }
      ]
    },
    {
      id: 3,
      teacher: "Prof. Brown",
      subject: "Physics",
      availableDates: [
        { date: "Apr 7, 2025", slots: ["11:00 AM", "2:30 PM"] },
        { date: "Apr 11, 2025", slots: ["9:30 AM", "3:00 PM"] }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Appointments</CardTitle>
        <CardDescription>Schedule one-on-one sessions with your teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="available">Available Slots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>No upcoming appointments</p>
                <Button variant="outline" className="mt-2" onClick={() => setShowModal(true)}>
                  Schedule Now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="bg-purple-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                          <User size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.teacher}</h3>
                          <p className="text-sm text-gray-500">{appointment.subject}</p>
                          <div className="flex gap-x-3 gap-y-1 mt-2 flex-wrap text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="inline mr-1 h-3 w-3" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="inline mr-1 h-3 w-3" />
                              {appointment.time} ({appointment.duration})
                            </span>
                            <span className="flex items-center">
                              {appointment.type === "video" ? (
                                <Video className="inline mr-1 h-3 w-3" />
                              ) : (
                                <User className="inline mr-1 h-3 w-3" />
                              )}
                              {appointment.type === "video" ? "Video Call" : "In-Person"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {appointment.type === "video" && (
                          <Button size="sm">Join Call</Button>
                        )}
                        <Button variant="outline" size="sm">Reschedule</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>No past appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="bg-gray-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.teacher}</h3>
                          <p className="text-sm text-gray-500">{appointment.subject}</p>
                          <div className="flex gap-x-3 gap-y-1 mt-2 flex-wrap text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="inline mr-1 h-3 w-3" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="inline mr-1 h-3 w-3" />
                              {appointment.time} ({appointment.duration})
                            </span>
                          </div>
                          {appointment.feedback && (
                            <div className="mt-3 p-2 bg-gray-50 rounded-md text-xs">
                              <p className="font-medium mb-1">Teacher Feedback:</p>
                              <p>{appointment.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-1 h-3 w-3" /> Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available">
            <div className="space-y-6">
              {availableSlots.map((teacher) => (
                <div key={teacher.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{teacher.teacher}</h3>
                      <p className="text-sm text-gray-500">{teacher.subject}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    {teacher.availableDates.map((dateInfo, idx) => (
                      <div key={idx} className="pl-2 border-l-2 border-blue-200">
                        <p className="text-sm font-medium">{dateInfo.date}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {dateInfo.slots.map((slot, slotIdx) => (
                            <Button key={slotIdx} variant="outline" size="sm">
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Contact Support</Button>
        <Button onClick={() => setShowModal(true)}>Schedule New Appointment</Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentsWidget;
