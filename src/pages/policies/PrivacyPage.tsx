import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
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
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-xl text-gray-600 mb-8">CoLearnerr Pvt. Ltd.</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            This Privacy Policy explains how CoLearnerr Pvt. Ltd. ("we," "us," or "our") collects, uses, shares, and protects your information when you use our website, apps, or services (collectively, the "Platform").
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">2. Information We Collect</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p className="text-gray-600">
              We collect personal details such as:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Your name</li>
              <li>Email address</li>
              <li>Educational institution</li>
              <li>Graduation status</li>
              <li>Session details including time, type, and duration</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Automatically Collected Data</h3>
            <p className="text-gray-600">
              This includes:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Your IP address</li>
              <li>Browser type</li>
              <li>Device identifiers</li>
              <li>Usage patterns</li>
              <li>Login times</li>
              <li>Activity logs</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use your data to:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Manage your account</li>
            <li>Match you with teachers or learners</li>
            <li>Process payments</li>
            <li>Send updates and notifications</li>
            <li>Improve the Platform and user experience</li>
            <li>Respond to support requests</li>
            <li>Monitor for misuse or fraudulent activities</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">4. Sharing Your Information</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              We do not sell your data.
            </p>
            <p className="text-gray-600">
              We may share your information with:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Trusted service providers for hosting, payments, analytics, or other services necessary to operate the Platform</li>
              <li>Legal authorities if required by law</li>
              <li>Internal teams for quality control and dispute resolution</li>
            </ul>
            <p className="text-gray-600">
              Third-party providers are required to adhere to strict data protection and confidentiality standards.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">5. Data Security</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              We protect your information using:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Encryption protocols</li>
              <li>HTTPS/SSL technology</li>
              <li>Secure access controls and monitoring</li>
            </ul>
            <p className="text-gray-600">
              Note: No system can guarantee 100% security. Please use strong passwords and avoid sharing sensitive information during sessions.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">6. Data Retention</h2>
          <p className="text-gray-600">
            We retain your information as long as your account is active or as needed to comply with legal, financial, or dispute-related obligations. You may request deletion of your data, which we will process unless we are legally required to retain it.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">7. Your Rights</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              You have the right to:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Access, correct, or delete your personal data</li>
              <li>Withdraw consent for data processing (which may affect your ability to use the Platform)</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">8. Cookies</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              We use cookies to:
            </p>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Keep you logged in</li>
              <li>Track usage</li>
              <li>Analyze traffic</li>
            </ul>
            <p className="text-gray-600">
              You can manage cookies through your browser settings.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">9. Children's Privacy</h2>
          <p className="text-gray-600">
            Users under 18 years old must have parental supervision. We do not knowingly collect personal information from children without parental consent.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">10. External Links</h2>
          <p className="text-gray-600">
            Our Platform may contain links to external websites. We are not responsible for the privacy practices or content of these third-party sites.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">11. Updates to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy periodically due to legal or technological changes. Major updates will be communicated via email or Platform alerts. Continued use of the Platform indicates your acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">12. Contact Us</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              For questions regarding this Privacy Policy, please contact:{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>
            </p>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Have Questions About Your Privacy?</h2>
            <p className="text-gray-600 mb-4">
              Our support team is here to address any concerns or questions about how we handle your data.
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

export default PrivacyPage;