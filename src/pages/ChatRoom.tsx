import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, ArrowLeft } from "lucide-react";
import ChatRoomComponent from "@/components/tutors/ChatRoom";

const ChatRoomPage = () => {
  const { user } = useAuth();
  const { tutorId } = useParams();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="container-custom py-8">
      <ChatRoomComponent />
    </main>
  );
};

export default ChatRoomPage;
