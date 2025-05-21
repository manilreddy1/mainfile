import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const RefundPage = () => {
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
            <BreadcrumbPage>Refund Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-xl text-gray-600 mb-8">CoLearnerr Pvt. Ltd.</p>

        <div className="prose prose-lg max-w-none">
          <p className="mb-8">
            At CoLearnerr, we strive to ensure a fair and transparent refund process for our users. Below are the details of our Refund Policy to help you understand when and how refunds are processed.
          </p>

          <h2 className="text-2xl font-bold mb-6">1. Refund Eligibility</h2>
          <p className="text-gray-600 mb-4">
            Refunds are eligible under the following circumstances:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>The session was canceled by the teacher.</li>
            <li>The session did not occur and was not rescheduled within 7 days.</li>
            <li>Technical issues on CoLearnerr's side prevented the session.</li>
            <li>The session was incomplete or did not meet basic quality standards.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">2. Refund Ineligibility</h2>
          <p className="text-gray-600 mb-4">
            Refunds are not eligible in the following cases:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>The user missed the session without prior notice.</li>
            <li>Dissatisfaction is based on personal expectations rather than objective issues.</li>
            <li>No dispute was raised within 24 hours after session completion.</li>
            <li>Refund is requested after 7 days from the session date.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">3. Session Packages</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Refunds for session packages are prorated based on the number of sessions used.
            </p>
            <p className="text-gray-600">
              Full refund is allowed only if no sessions have been used and the refund request is made within 7 days of purchase.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">4. How to Request a Refund</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              To request a refund, contact us by emailing{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>{' '}
              or using the in-app Help & Support feature.
            </p>
            <p className="text-gray-600">
              Please provide the following details: session ID, date and time, teacher name, and reason for the refund request.
            </p>
            <p className="text-gray-600">
              You will receive a response within 3–5 business days.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">5. Refund Processing Time</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Refunds are processed within 7–10 business days.
            </p>
            <p className="text-gray-600">
              Refunds will be issued to the original payment method.
            </p>
            <p className="text-gray-600">
              You will receive an email confirmation when the refund has been initiated.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">6. Dispute Resolution</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              If your refund request is denied, you may escalate the matter by emailing{' '}
              <a href="mailto:admin@colearnerr.in" className="text-blue-600 hover:underline">
                admin@colearnerr.in
              </a>{' '}
              with supporting evidence.
            </p>
            <p className="text-gray-600">
              A final decision will be communicated within 5 business days.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">7. Abuse Warning</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Repeated or false refund claims may result in account suspension.
            </p>
            <p className="text-gray-600">
              Future refund requests from such accounts may be denied.
            </p>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Need Help with a Refund?</h2>
            <p className="text-gray-600 mb-4">
              Our support team is here to assist with any refund-related questions or concerns.
            </p>
            <p className="text-gray-600">
              Contact us at{' '}
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

export default RefundPage;