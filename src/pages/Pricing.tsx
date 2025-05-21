import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Pricing = () => {
  return (
    <div className="container-custom py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pricing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">💸 Our Pricing Plan</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">📚 CoLearnerr Learning Plan</h2>
          <p className="text-lg text-gray-600 mb-8">
            Ideal for students in Classes 6 to 10, guided by skilled B.Tech student tutors
          </p>

          <h3 className="text-xl font-semibold mb-4">Get full access to:</h3>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span>👨‍🏫 1-on-1 Live Sessions with expert student tutors</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span>📅 Flexible scheduling & easy rescheduling</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span>💡 Personalized academic support in core subjects</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span>🧠 Career guidance & mentoring sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span>🛠️ Skill development programs (public speaking, coding, critical thinking, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <span>🧾 Progress tracking & performance analytics</span>
            </li>
          </ul>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-bold mb-4">✅ One-Time Plan: ₹3999</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• No hidden costs</li>
              <li>• Includes all features above</li>
              <li>• Sessions valid for the full duration of the program</li>
              <li>• Safe and secure payments</li>
              <li>• Refunds as per our Refund Policy</li>
            </ul>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            🎯 Empower your learning journey with the right guidance, practical skills, and affordable mentorship—only at ₹3999.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/register" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              🔗 Enroll Now
            </a>
            <a 
              href="mailto:support@colearnerr.in" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              📧 Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 