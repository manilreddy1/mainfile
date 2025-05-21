import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Check, MessageSquare, Star, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/lib/supabase/types";
import PaymentModal from "./PaymentModal";

interface Review {
  id: number;
  studentName: string;
  date: string;
  rating: number;
  comment: string;
}

// Mock reviews data
const reviewsData: Review[] = [
  {
    id: 1,
    studentName: "John D.",
    date: "2023-04-15",
    rating: 5,
    comment: "Amazing teacher! Very patient and explains concepts clearly."
  },
  {
    id: 2,
    studentName: "Sarah M.",
    date: "2023-03-22",
    rating: 4,
    comment: "Very knowledgeable in the subject. Helped me prepare for my exam."
  },
  {
    id: 3,
    studentName: "Michael T.",
    date: "2023-02-10",
    rating: 5,
    comment: "Excellent tutor. Makes learning fun and engaging."
  }
];

interface TutorModalProps {
  tutor: {
    id: number;
    name: string;
    subjects: string[];
    rating: number;
    price: string;
    image: string;
    description: string;
    languages: string[];
    qualifications: string[];
    demoVideo?: string;
    experience: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const TutorModal = ({ tutor, isOpen, onClose }: TutorModalProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("about");
  
  const handleBookSession = () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to book a session",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Check if user is a student
    if (profile?.user_type !== UserType.STUDENT) {
      toast({
        title: "Access restricted",
        description: "Only students can book tutoring sessions",
        variant: "destructive",
      });
      return;
    }
    
    // Open payment modal
    setPaymentModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <img 
                src={tutor.image} 
                alt={tutor.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <DialogTitle className="text-xl">{tutor.name}</DialogTitle>
                <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="ml-1 font-medium">{tutor.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{tutor.experience} years experience</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="about" value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="videos">Demo Video</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{tutor.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map(subject => (
                      <Badge key={subject} variant="secondary">{subject}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.languages.map(language => (
                      <Badge key={language} variant="outline" className="bg-blue-50">{language}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Qualifications</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {tutor.qualifications.map((qualification, index) => (
                      <li key={index} className="text-gray-700">{qualification}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              {tutor.demoVideo ? (
                <div>
                  <h3 className="font-semibold mb-3">Demo Video</h3>
                  <div className="relative pb-[56.25%] h-0">
                    <iframe 
                      src={tutor.demoVideo} 
                      title={`${tutor.name}'s Demo Video`}
                      className="absolute top-0 left-0 w-full h-full rounded-lg" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No demo videos available</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews">
              <div>
                <h3 className="font-semibold mb-3">Student Reviews</h3>
                
                {reviewsData.length > 0 ? (
                  <div className="space-y-4">
                    {reviewsData.map(review => (
                      <Card key={review.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{review.studentName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span className="ml-1">{review.rating}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews available yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-4 mt-6">
            <div className="text-xl font-bold">₹3999</div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button 
                className="flex items-center gap-2" 
                variant="outline" 
                onClick={() => {
                  onClose();
                  toast({
                    title: "Feature coming soon",
                    description: "Direct messaging will be available in the next update",
                  });
                }}
              >
                <MessageSquare className="h-4 w-4" /> 
                Message
              </Button>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={handleBookSession}
              >
                <Calendar className="h-4 w-4" />
                Book Session
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        tutor={tutor}
      />
    </>
  );
};

export default TutorModal;
