import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Careers = () => {
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
            <BreadcrumbPage>Careers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Careers at CoLearnerr</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl font-semibold text-blue-600 mb-6">
            Join us in shaping the future of peer-to-peer learning.
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
            <p className="mb-4">
              At CoLearnerr, we're building more than just a platform — we're creating a revolution in education. Our 
              mission is to empower students and recent graduates by giving them a space to teach, learn, and grow 
              together.
            </p>
            <p>
              We're looking for passionate individuals who believe in community-driven learning and want to contribute to 
              an ecosystem that's transforming how education is delivered.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A fast-paced, mission-driven work environment</li>
              <li>Opportunities to work with cutting-edge edtech solutions</li>
              <li>Start-up culture with room for rapid growth</li>
              <li>Flexible, collaborative team structure</li>
              <li>Hybrid & remote roles (for select positions)</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">We're Hiring For:</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Frontend Developer (React/Next.js)</li>
              <li>Backend Developer (Python/FastAPI/Supabase)</li>
              <li>UI/UX Designer</li>
              <li>Community Manager (Student Relations)</li>
              <li>Content & Outreach Specialist</li>
              <li>Internships for College Students (All Roles)</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
            <p className="mb-4">Send your resume and a short intro to:</p>
            <div className="flex items-center gap-2 text-blue-600">
              <Mail className="w-5 h-5" />
              <a href="mailto:careers@colearnerr.in" className="hover:underline">
                careers@colearnerr.in
              </a>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Subject: "[Position Name] Application – [Your Name]"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers; 