import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const CareersPage = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Careers at CoLearnerr Pvt. Ltd.</h1>
        <p className="text-xl text-gray-600 mb-8">Join us in shaping the future of peer-to-peer learning.</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-6">1. Why Work With Us?</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              At CoLearnerr, we're building more than just a platform — we're creating a revolution in education. Our mission is to empower students and recent graduates by giving them a space to teach, learn, and grow together.
            </p>
            <p className="text-gray-600">
              We're looking for passionate individuals who believe in community-driven learning and want to contribute to an ecosystem that's transforming how education is delivered.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">2. What We Offer</h2>
          <p className="text-gray-600 mb-4">
            Joining CoLearnerr means you’ll enjoy:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>A fast-paced, mission-driven work environment</li>
            <li>Opportunities to work with cutting-edge edtech solutions</li>
            <li>Start-up culture with room for rapid growth</li>
            <li>Flexible, collaborative team structure</li>
            <li>Hybrid & remote roles (for select positions)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">3. We're Hiring For</h2>
          <p className="text-gray-600 mb-4">
            We’re excited to welcome talent for the following roles:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Frontend Developer (React/Next.js)</li>
            <li>Backend Developer (Python/FastAPI/Supabase)</li>
            <li>UI/UX Designer</li>
            <li>Community Manager (Student Relations)</li>
            <li>Content & Outreach Specialist</li>
            <li>Internships for College Students (All Roles)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">4. How to Apply</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Send your resume and a short intro to:{' '}
              <a href="mailto:careers@colearnerr.in" className="text-blue-600 hover:underline">
                careers@colearnerr.in
              </a>
            </p>
            <p className="text-gray-600">
              Subject: "[Position Name] Application – [Your Name]"
            </p>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Mission?</h2>
            <p className="text-gray-600 mb-4">
              If you’re passionate about education and technology, we’d love to hear from you. Apply today and help us transform learning!
            </p>
            <p className="text-gray-600">
              Email us at{' '}
              <a href="mailto:careers@colearnerr.in" className="text-blue-600 hover:underline">
                careers@colearnerr.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;