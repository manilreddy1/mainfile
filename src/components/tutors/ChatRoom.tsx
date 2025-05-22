import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Send,
  Upload,
  Video,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import SessionRatingModal from "./SessionRatingModal";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMine: boolean;
  file_url?: string;
}

interface Contact {
  id: string;
  name: string;
  image: string;
  subject?: string;
}

const ChatRoom = () => {
  const { tutorId: tutorIdParam } = useParams<{ tutorId: string }>();
  const tutorId = tutorIdParam ? parseInt(tutorIdParam, 10) : 0;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get("student");

  const { user, profile, getAssignedTutors } = useAuth();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionDuration, setSessionDuration] = useState("60");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTeacher = profile?.user_type === "teacher";
  const isStudent = profile?.user_type === "student";
  const mode = isTeacher ? "teacher" : "student";

  // Fetch contact data (student for teacher, tutor for student)
  useEffect(() => {
    const fetchContactData = async () => {
      if (!user || !profile) return;

      try {
        if (mode === "teacher") {
          if (!studentId) throw new Error("Student ID is missing.");

          const { data, error } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .eq("id", studentId)
            .eq("user_type", "student")
            .single();

          if (error) throw error;
          if (!data) throw new Error("Student not found.");

          setContact({
            id: data.id,
            name: `${data.first_name} ${data.last_name}`,
            image: data.avatar_url || "https://i.pravatar.cc/150?img=2",
          });
          setContactName(`${data.first_name} ${data.last_name}`);
        } else {
          if (!tutorId) throw new Error("Tutor ID is missing.");

          const { data, error } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url, subject")
            .eq("tutor_id", tutorId)
            .eq("user_type", "teacher")
            .single();

          if (error) throw error;
          if (!data) throw new Error("Tutor not found.");

          setContact({
            id: data.id,
            name: `${data.first_name} ${data.last_name}`,
            image: data.avatar_url || "https://i.pravatar.cc/150?img=1",
            subject: data.subject || "Unknown",
          });
          setContactName(`${data.first_name} ${data.last_name}`);
        }
      } catch (error: any) {
        console.error(`Error fetching ${mode === "teacher" ? "student" : "tutor"} data:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${mode === "teacher" ? "student" : "tutor"} data.`,
          variant: "destructive",
        });
        navigate(mode === "teacher" ? "/teacher-dashboard" : "/search");
      }
    };

    fetchContactData();
  }, [tutorId, studentId, user, profile, mode, navigate]);

  // Check access, load messages, and set up real-time subscription
  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !profile) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the chat room",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (mode === "teacher") {
        const teacherTutorId = profile.tutor_id;
        if (!teacherTutorId || teacherTutorId !== tutorId) {
          toast({
            title: "Access denied",
            description: "You can only chat with students assigned to you.",
            variant: "destructive",
          });
          navigate("/teacher-dashboard");
          return;
        }

        if (!studentId) {
          toast({
            title: "Access denied",
            description: "Student ID is required to chat.",
            variant: "destructive",
          });
          navigate("/teacher-dashboard");
          return;
        }

        const { data: assignment, error } = await supabase
          .from("student_tutor_assignments")
          .select("*")
          .eq("tutor_id", teacherTutorId)
          .eq("student_id", studentId)
          .eq("status", "active")
          .single();

        if (error || !assignment) {
          toast({
            title: "Access denied",
            description: "This student is not assigned to you.",
            variant: "destructive",
          });
          navigate("/teacher-dashboard");
          return;
        }

        setIsAccessAllowed(true);
      } else {
        const assignments = await getAssignedTutors();
        const isTutorAssigned = assignments.some(
          (assignment) => assignment.tutor_id === tutorId
        );

        setIsAccessAllowed(isTutorAssigned);

        if (!isTutorAssigned) {
          toast({
            title: "Access denied",
            description: "You need to book this tutor first",
            variant: "destructive",
          });
          navigate("/search");
          return;
        }
      }

      await loadMessages();
      setHasLoaded(true);

      // Real-time subscription for messages
      const channel = supabase
        .channel(`chat:${tutorId}:${studentId || user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `tutor_id=eq.${tutorId}`,
          },
          (payload) => {
            const newMsg = payload.new;
            // Ensure the message belongs to this chat
            if (
              (mode === "teacher" && newMsg.student_id !== studentId) ||
              (mode === "student" && newMsg.student_id !== user.id)
            ) {
              return;
            }

            // Avoid duplicates with optimistic updates
            if (newMsg.sender_type === mode) return;

            const formattedMsg: Message = {
              id: newMsg.id,
              sender:
                newMsg.sender_type === "student"
                  ? mode === "teacher"
                    ? contact?.name || "Student"
                    : profile?.first_name || "Me"
                  : mode === "teacher"
                    ? profile?.first_name || "Me"
                    : contact?.name || "Tutor",
              text: newMsg.content,
              timestamp: new Date(newMsg.created_at),
              isMine: newMsg.sender_type === (mode === "teacher" ? "teacher" : "student"),
              file_url: newMsg.file_url,
            };
            setMessages((prev) => [...prev, formattedMsg]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkAccess();
  }, [user, profile, tutorId, studentId, mode, getAssignedTutors, navigate, contact]);

  // Load existing messages
  const loadMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const query = supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (mode === "teacher") {
        query.eq("tutor_id", tutorId).eq("student_id", studentId);
      } else {
        query.eq("student_id", user.id).eq("tutor_id", tutorId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          sender:
            msg.sender_type === "student"
              ? mode === "teacher"
                ? contact?.name || "Student"
                : profile?.first_name || "Me"
              : mode === "teacher"
                ? profile?.first_name || "Me"
                : contact?.name || "Tutor",
          text: msg.content,
          timestamp: new Date(msg.created_at),
          isMine: msg.sender_type === (mode === "teacher" ? "teacher" : "student"),
          file_url: msg.file_url,
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (hasLoaded) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasLoaded]);

  // Send a message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !file) || !user) return;

    try {
      setSending(true);

      let fileUrl = null;
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("chat_files")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("chat_files").getPublicUrl(fileName);
        fileUrl = data.publicUrl;
      }

      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: Message = {
        id: tempId,
        sender: profile?.first_name || "Me",
        text: newMessage,
        timestamp: new Date(),
        isMine: true,
        file_url: fileUrl,
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      const messageData = {
        student_id: mode === "teacher" ? studentId : user.id,
        tutor_id: tutorId,
        content: newMessage,
        file_url: fileUrl,
        sender_type: mode,
        created_at: new Date().toISOString(),
      };

      const { data: insertedMsg, error } = await supabase
        .from("messages")
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Update the optimistic message with the real ID
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, id: insertedMsg.id, timestamp: new Date(insertedMsg.created_at) }
            : msg
        )
      );

      setNewMessage("");
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Only PDF and image files (JPEG, PNG, JPG) are allowed.",
          variant: "destructive",
        });
        return;
      }

      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Files must be smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  // Start a video call with the tutor as admin
  const startVideoCall = () => {
    toast({
      title: "Video call initiated",
      description: "Setting up your video call connection...",
    });

    const roomName = `tutor-${tutorId}-${Date.now()}`;
    const jitsiDomain = "meet.jit.si";
    const jitsiUrl = new URL(`https://${jitsiDomain}/${roomName}`);

    // Add user info to identify the tutor
    jitsiUrl.searchParams.append("userInfo.name", profile?.first_name || "Tutor");
    jitsiUrl.searchParams.append("userInfo.email", profile?.email || "tutor@example.com");
    jitsiUrl.searchParams.append("config.startWithVideoMuted", "false");
    jitsiUrl.searchParams.append("config.startWithAudioMuted", "false");

    // Update the session with the meeting link
    const updateSessionWithLink = async () => {
      try {
        const { data: session } = await supabase
          .from("scheduled_sessions")
          .select("id")
          .eq("tutor_id", tutorId)
          .eq("student_id", mode === "teacher" ? studentId : user.id)
          .eq("status", "scheduled")
          .gte("start_time", new Date().toISOString())
          .order("start_time", { ascending: true })
          .limit(1);

        if (session && session.length > 0) {
          await supabase
            .from("scheduled_sessions")
            .update({
              meeting_link: jitsiUrl.toString(),
              status: "in_progress",
            })
            .eq("id", session[0].id);
        }
      } catch (error) {
        console.error("Error updating session with meeting link:", error);
      }
    };

    updateSessionWithLink();

    setTimeout(() => {
      window.open(jitsiUrl.toString(), "_blank");
    }, 1500);
  };

  // Schedule a session
  const handleScheduleSession = async () => {
    if (!sessionTitle || !sessionDate || !sessionTime || !sessionDuration || !user) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to schedule a session.",
        variant: "destructive",
      });
      return;
    }

    try {
      const startTime = new Date(`${sessionDate}T${sessionTime}`);
      const currentTime = new Date();

      if (startTime <= currentTime) {
        toast({
          title: "Invalid date/time",
          description: "Please schedule the session for a future date and time.",
          variant: "destructive",
        });
        return;
      }

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + parseInt(sessionDuration));

      const { data, error } = await supabase
        .from("scheduled_sessions")
        .insert({
          student_id: mode === "teacher" ? studentId : user.id,
          tutor_id: tutorId,
          title: sessionTitle,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: "scheduled",
        })
        .select()
        .single();

      if (error) throw error;

      // Notify the other party via a message
      await supabase.from("messages").insert({
        student_id: mode === "teacher" ? studentId : user.id,
        tutor_id: tutorId,
        content: `New session scheduled: "${sessionTitle}" on ${startTime.toLocaleString()}`,
        sender_type: mode,
      });

      toast({
        title: "Session scheduled",
        description: "Your tutoring session has been scheduled successfully.",
      });
      setShowScheduleModal(false);
      setSessionTitle("");
      setSessionDate("");
      setSessionTime("");
      setSessionDuration("60");
    } catch (error) {
      console.error("Error scheduling session:", error);
      toast({
        title: "Error",
        description: "Failed to schedule session.",
        variant: "destructive",
      });
    }
  };

  // End a video session
  const endVideoSession = async (sessionId: string) => {
    try {
      await supabase
        .from("scheduled_sessions")
        .update({ status: "completed" })
        .eq("id", sessionId);

      setCompletedSessionId(sessionId);
      setShowRatingModal(true);

      toast({
        title: "Session ended",
        description: "Please rate your experience.",
      });
    } catch (error) {
      console.error("Error ending session:", error);
      toast({
        title: "Error",
        description: "Failed to end session.",
        variant: "destructive",
      });
    }
  };

  // Auto-start sessions and check for completed sessions
  useEffect(() => {
    const checkForSessions = async () => {
      if (!user || !contact) return;

      try {
        const teacherId = mode === "student" ? contact.id : profile?.id;
        const studentIdForQuery = mode === "teacher" ? studentId : user.id;

        // Auto-start scheduled sessions for the tutor
        const now = new Date();
        const { data: sessionsToStart } = await supabase
          .from("scheduled_sessions")
          .select("id, start_time, meeting_link")
          .eq("student_id", studentIdForQuery)
          .eq("tutor_id", tutorId)
          .eq("status", "scheduled")
          .lte("start_time", now.toISOString())
          .limit(1);

        if (sessionsToStart && sessionsToStart.length > 0) {
          const session = sessionsToStart[0];
          if (mode === "teacher" && !session.meeting_link) {
            const roomName = `tutor-${tutorId}-${Date.now()}`;
            const jitsiUrl = `https://meet.jit.si/${roomName}`;
            await supabase
              .from("scheduled_sessions")
              .update({
                meeting_link: jitsiUrl,
                status: "in_progress",
              })
              .eq("id", session.id);

            toast({
              title: "Starting Session",
              description: "Your scheduled session is starting now.",
            });
            window.open(jitsiUrl, "_blank");
          }
        }

        // Check for completed sessions to rate
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const { data: sessions } = await supabase
          .from("scheduled_sessions")
          .select("id, status")
          .eq("student_id", studentIdForQuery)
          .eq("tutor_id", tutorId)
          .eq("status", "completed")
          .gte("end_time", oneDayAgo.toISOString())
          .order("end_time", { ascending: false })
          .limit(1);

        if (sessions && sessions.length > 0) {
          const { data: existingRating } = await supabase
            .from("teacher_ratings")
            .select("id")
            .eq("student_id", studentIdForQuery)
            .eq("teacher_id", teacherId)
            .eq("session_id", sessions[0].id);

          if (!existingRating || existingRating.length === 0) {
            setCompletedSessionId(sessions[0].id);
            setShowRatingModal(true);
          }
        }
      } catch (error) {
        console.error("Error checking for sessions:", error);
      }
    };

    if (user && tutorId && (mode === "teacher" ? studentId : true)) {
      checkForSessions();
    }
  }, [user, tutorId, studentId, mode, contact, profile]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading chat room...</p>
      </div>
    );
  }

  // Access denied state
  if (!isAccessAllowed) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Required</h1>
          <p className="mb-6 text-gray-600">
            {mode === "teacher"
              ? "This student is not assigned to you."
              : "You need to book this tutor before you can access the chat room."}
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(mode === "teacher" ? "/teacher-dashboard" : "/search")}
          >
            {mode === "teacher" ? "Go to Dashboard" : "Browse Tutors"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={contact?.image}
              alt={contact?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="font-semibold">{contact?.name}</h1>
              <p className="text-sm text-gray-600">
                {mode === "teacher" ? "Student" : `${contact?.subject} Tutor`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-1"
            >
              <Calendar size={16} />
              <span className="hidden sm:inline">Schedule</span>
            </Button>

            <Button
              size="sm"
              onClick={startVideoCall}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
            >
              <Video size={16} />
              <span className="hidden sm:inline">Start Video Call</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto p-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.isMine ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-[80%] ${message.isMine ? "bg-blue-50" : "bg-white"}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-800">{message.text}</p>

                    {message.file_url && (
                      <div className="mt-2">
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm flex items-center hover:underline"
                        >
                          <Upload size={14} className="mr-1" />
                          View Attachment
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      {file && (
        <div className="bg-blue-50 p-2 border-t">
          <div className="container mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white border-t p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </Button>

            <Input
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-grow"
              disabled={sending}
            />

            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSendMessage}
              disabled={sending}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule a Session</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                placeholder="e.g., Calculus Tutorial"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <select
                id="duration"
                className="w-full p-2 border rounded"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleScheduleSession}
            >
              Schedule Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SessionRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        teacherId={mode === "student" ? (contact ? contact.id : "") : (profile ? profile.id : "")}
        studentId={mode === "teacher" ? (studentId || "") : (user?.id || "")}
        sessionId={completedSessionId || ""}
        teacherName={contactName}
      />
    </div>
  );
};

export default ChatRoom;
