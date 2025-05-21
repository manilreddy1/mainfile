
import { useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "CoLearnerr helped me improve my grades significantly. My math tutor explained concepts in a way that finally made sense to me. Now I'm confident going into exams!",
    author: "Emma Rodriguez",
    role: "Student, Computer Science",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    id: 2,
    content: "Teaching on CoLearnerr has been a rewarding experience. The platform is intuitive, and I love being able to help students from anywhere in the world.",
    author: "David Chen",
    role: "Physics Teacher, 5+ years experience",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5
  },
  {
    id: 3,
    content: "I wanted to learn graphic design but couldn't commit to a full-time course. My CoLearnerr tutor created a custom learning plan that worked with my schedule!",
    author: "Sarah Johnson",
    role: "Marketing Professional",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 4
  },
  {
    id: 4,
    content: "As a parent, I appreciate how CoLearnerr makes it easy to find qualified tutors for my children. The video call feature means my kids can learn safely from home.",
    author: "Michael Thompson",
    role: "Parent of two teenagers",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 5,
    content: "I was struggling with my language studies until I found a native speaker on CoLearnerr. Now I'm conversational in Spanish after just 3 months of lessons!",
    author: "Lisa Kim",
    role: "Language Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 5
  },
  {
    id: 6,
    content: "The flexibility to teach on my own schedule has been amazing. CoLearnerr has become my main source of income while I finish my graduate studies.",
    author: "James Wilson",
    role: "Graduate Student & Math Tutor",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + 3);

  const nextTestimonials = () => {
    setActiveIndex((prevIndex) => 
      prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 3
    );
  };

  const prevTestimonials = () => {
    setActiveIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prevIndex - 3
    );
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from students and teachers who have experienced the benefits of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white border border-gray-100 rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-4">
          <button 
            onClick={prevTestimonials}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonials"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonials}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            aria-label="Next testimonials"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
