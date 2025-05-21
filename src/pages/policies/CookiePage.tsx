import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const CookiePage = () => {
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
            <BreadcrumbPage>Cookie Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-xl text-gray-600 mb-8">CoLearnerr Pvt. Ltd. </p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            This Cookie Policy explains how CoLearnerr Pvt. Ltd. ("we," "us," or "our") uses cookies and other tracking technologies on our website and services (collectively, the "Platform") to enhance your experience. This policy is part of our Privacy Policy and Terms of Service.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">2. What are Cookies?</h2>
          <p className="text-gray-600">
            Cookies are small text files stored on your device that help us recognize your device, save your preferences, and collect data on your usage to provide a personalized experience.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">3. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
            <p className="text-gray-600">
              These cookies are necessary to:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Enable login sessions</li>
              <li>Secure your account</li>
              <li>Support site navigation</li>
            </ul>
            <p className="text-gray-600">
              They cannot be disabled as they are fundamental to the operation of the Platform.
            </p>

            <h3 className="text-xl font-semibold mb-3">Performance Cookies</h3>
            <p className="text-gray-600">
              These cookies collect anonymized data such as:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Clicks</li>
              <li>Errors</li>
            </ul>
            <p className="text-gray-600">
              This helps us optimize the speed and usability of the Platform.
            </p>

            <h3 className="text-xl font-semibold mb-3">Analytics Cookies</h3>
            <p className="text-gray-600">
              These track metrics like:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Page visits</li>
              <li>Time spent on pages</li>
            </ul>
            <p className="text-gray-600">
              This helps us improve features and services.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">4. How We Use Cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies allow us to:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Keep you logged in securely</li>
            <li>Monitor Platform usage</li>
            <li>Analyze user behavior to deliver better content</li>
            <li>Ensure secure and smooth service delivery</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">5. Third-Party Cookies</h2>
          <p className="text-gray-600">
            We may allow third-party services, such as analytics providers or video call services, to set cookies on the Platform. While these third parties must comply with our data protection rules, we do not control their cookie practices directly.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">6. Managing Cookies</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              You can manage non-essential cookies through your browser settings to accept, reject, or delete them. Please note:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Blocking cookies may reduce some Platform functionalities</li>
              <li>Essential cookies are always required and cannot be disabled</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">7. Security of Cookie Data</h2>
          <p className="text-gray-600">
            Cookies that contain personal data are protected with encryption and HTTPS/SSL protocols, as described in our Privacy Policy. We do not sell or share cookie data except when required by law or for service purposes.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">8. Your Rights</h2>
          <p className="text-gray-600">
            You can request access to, correction, or deletion of cookie-related data by contacting us at{' '}
            <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
              support@colearnerr.in
            </a>, as outlined in our Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">9. Updates to This Policy</h2>
          <p className="text-gray-600">
            We may update this Cookie Policy due to technological or legal changes. Major updates will be communicated via email or Platform alerts. Continued use of the Platform after updates indicates your acceptance.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">10. Contact Us</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              If you have any questions about this Cookie Policy, please contact us at:{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>
            </p>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Our support team is here to help with any questions or concerns about how we use cookies on the Platform.
            </p>
            <p className="text-gray-600">
              Reach out at{' '}
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

export default CookiePage;