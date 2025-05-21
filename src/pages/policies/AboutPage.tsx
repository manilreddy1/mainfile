import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const AboutPage = () => {
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
            <BreadcrumbPage>About Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">About CoLearnerr Pvt. Ltd.</h1>
        <p className="text-xl text-gray-600 mb-8">Empowering Peer-to-Peer Learning</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-6">1. Our Mission</h2>
          <p className="text-gray-600">
            CoLearnerr Pvt. Ltd. is a peer-to-peer learning platform crafted for students and recent graduates. Our mission is to empower everyone to learn new skills and teach their expertise, fostering a community of growth and collaboration.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">2. What We Offer</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              We connect users through live 1-on-1 sessions, offering:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Barter-based skill exchanges</li>
              <li>Paid collaborations</li>
              <li>Flexible learning options</li>
              <li>A distraction-free dashboard</li>
              <li>Robust privacy protections</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">3. Our Vision</h2>
          <p className="text-gray-600">
            Based in India with a global outlook, we prioritize security, accessibility, and a student-focused experience. We envision CoLearnerr as the go-to hub where young learners and mentors shape their futures through shared knowledge.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">4. Get in Touch</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Join us to learn, teach, and grow. Contact us at{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>
            </p>
            <p className="text-gray-600">
              Visit our headquarters in Hyderabad, Telangana, India.
            </p>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Join the Learning Revolution</h2>
            <p className="text-gray-600 mb-4">
              CoLearnerr Pvt. Ltd. — Knowledge Shared, Futures Built. Ready to be part of our community?
            </p>
            <p className="text-gray-600">
              Email us at{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;