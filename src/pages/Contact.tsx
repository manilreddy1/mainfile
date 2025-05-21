import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

const Contact = () => {
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
            <BreadcrumbPage>Contact Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Get In Touch</h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          We're here to help, listen, and grow together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Support for Learners & Educators</h2>
              <p className="text-gray-600 mb-4">Having issues with sessions, payments, or your dashboard?</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                  support@colearnerr.in
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Careers & Internship Opportunities</h2>
              <p className="text-gray-600 mb-4">Interested in working with us?</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:careers@colearnerr.in" className="text-blue-600 hover:underline">
                  careers@colearnerr.in
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Partnerships & Collaborations</h2>
              <p className="text-gray-600 mb-4">If you're an institution or organization looking to collaborate:</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:admin@colearnerr.in" className="text-blue-600 hover:underline">
                  admin@colearnerr.in
                </a>
              </div>
            </div>
          </div>

          {/* Social Media & Address */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
              <p className="text-gray-600 mb-4">Stay updated on our journey:</p>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/colearenerr-in/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/colearnerr.in" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Address</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div className="text-gray-700">
                  <p className="font-medium">CoLearnerr Head Quarters</p>
                  <p>Hyderabad District</p>
                  <p>Telangana 500032</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 