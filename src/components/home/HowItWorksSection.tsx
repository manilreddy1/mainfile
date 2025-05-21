
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Search, Calendar, Video } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-10 h-10 text-blue-500" />,
    title: "Find Your Tutor",
    description: "Search for tutors by subject, skill, price, and availability. View detailed profiles to find your perfect match."
  },
  {
    icon: <Calendar className="w-10 h-10 text-blue-500" />,
    title: "Book a Session",
    description: "Select a time slot that works for you, and make a secure payment to confirm your booking."
  },
  {
    icon: <Video className="w-10 h-10 text-blue-500" />,
    title: "Connect & Learn",
    description: "Join your session via our integrated video platform. Learn, ask questions, and get personalized guidance."
  },
  {
    icon: <Users className="w-10 h-10 text-blue-500" />,
    title: "Rate & Review",
    description: "After your session, leave feedback for your tutor to help them improve and help other students make informed choices."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How CoLearnerr Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform makes it easy to connect with expert tutors and start learning in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/how-it-works">
            <Button variant="outline" className="font-medium">
              Learn More About Our Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
