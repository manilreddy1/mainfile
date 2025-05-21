import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HowItWorksPage = () => {
  return (
    <main className="container-custom py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>How It Works</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-4xl font-bold text-center mb-12">How CoLearnerr Works</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          CoLearnerr connects students with expert tutors for personalized learning experiences. 
          Our platform makes it easy to find the right tutor, book sessions, and improve your skills.
        </p>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">For Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600 mb-4">Sign up and tell us what subjects or skills you want to learn.</p>
            </div>
            <div className="border rounded-lg p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Find Your Tutor</h3>
              <p className="text-gray-600 mb-4">Browse profiles, read reviews, and choose the right tutor for your needs.</p>
            </div>
            <div className="border rounded-lg p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Book & Learn</h3>
              <p className="text-gray-600 mb-4">Schedule sessions at convenient times and connect with your tutor online.</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">For Teachers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600 mb-4">Sign up, list your expertise, and set your availability and rates.</p>
            </div>
            <div className="border rounded-lg p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Accept Bookings</h3>
              <p className="text-gray-600 mb-4">Receive booking requests from students and confirm sessions.</p>
            </div>
            <div className="border rounded-lg p-6 text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Teach & Earn</h3>
              <p className="text-gray-600 mb-4">Conduct online sessions and receive weekly payments for your expertise.</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Learning Platform</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Virtual Classroom Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>HD video conferencing for face-to-face interaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Interactive whiteboard for visual explanations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Screen sharing capabilities for demonstrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Document collaboration for reviewing work together</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Chat functionality for quick communication</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Platform Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Secure payment processing with protection for both parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Rating system to ensure quality learning experiences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Scheduling tools that respect your time zone</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Session history and progress tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>24/7 support for any technical or platform questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of students and teachers on CoLearnerr and start your learning journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Create an Account</Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline">Browse Tutors</Button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">How much does it cost to use CoLearnerr?</h3>
              <p className="text-gray-600">Registration is free. You only pay for the sessions you book with tutors, and prices vary depending on the tutor's rates.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">How are tutors verified?</h3>
              <p className="text-gray-600">All tutors undergo a verification process including ID verification, credential checks, and an initial screening interview.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">What if I'm not satisfied with my session?</h3>
              <p className="text-gray-600">We offer a satisfaction guarantee. If you're not happy with your session, you can request a refund or a free replacement session.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Can I change or cancel my booking?</h3>
              <p className="text-gray-600">Yes, you can reschedule or cancel bookings up to 24 hours before the scheduled session without any penalty.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HowItWorksPage;
