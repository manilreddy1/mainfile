import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const TermsPage = () => {
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
            <BreadcrumbPage>Terms & Conditions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-xl text-gray-600 mb-8">CoLearnerr Pvt. Ltd.</p>

        <div className="prose prose-lg max-w-none">
          <p className="mb-8">
            Welcome to CoLearnerr’s Terms and Conditions. By using our platform, you agree to these terms, which govern your access to our peer-to-peer learning services. Please read carefully.
          </p>

          <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              By accessing or using CoLearnerr's website, applications, or services (collectively, the "Platform"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these Terms, you must not use the Platform.
            </p>
            <p className="text-gray-600">
              We may update these Terms periodically. Your continued use of the Platform after such changes constitutes your acceptance of the updated Terms.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">2. Eligibility</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Only students enrolled in recognized educational institutions or graduates within two years of their degree are eligible to use the Platform.</li>
            <li>You must provide accurate and truthful information during registration and maintain the security of your account.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">3. Account Responsibility</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>To access features such as live 1-on-1 sessions, you must create an account with accurate details.</li>
            <li>
              Keep your login credentials secure and notify us immediately at{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>{' '}
              if you suspect unauthorized access.
            </li>
            <li>Accounts are personal and non-transferable. Do not share your account or access others' accounts.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">4. Permitted Use</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Use the Platform solely for peer-to-peer learning, paid or barter-based skill exchanges, and accessing analytics.</li>
            <li>Do not use the Platform for illegal activities, bypassing security, disrupting operations, or any unauthorized purpose.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">5. Booking and Sessions</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Sessions must be booked through the Platform, adhering to agreed pricing or barter terms.</li>
            <li>Professional conduct is required during sessions. Misuse may lead to session termination or account suspension.</li>
            <li>Sessions expire upon completion. Cancellation policies apply, and missed sessions may result in forfeiture of payment or credits.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">6. User Content</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Any session materials or content you provide ("User Content") must not contain hate speech, plagiarism, explicit content, or false claims.</li>
            <li>You are solely responsible for the legality of your User Content.</li>
            <li>Maintain professionalism and respect. Spam or harmful behavior may lead to content removal or account suspension.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">7. Payments and Refunds</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Payments for sessions must be made securely via our payment gateway.</li>
            <li>A service fee may be charged and will be disclosed at booking.</li>
            <li>Barter agreements are between users; CoLearnerr is not liable for barter disputes.</li>
            <li>Refunds may be issued for instructor cancellations, Platform errors, or valid disputes. Completed sessions are non-refundable.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">8. Intellectual Property</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>CoLearnerr owns all Platform content, logos, and trademarks. You may not copy or use them without prior permission.</li>
            <li>You retain ownership of your User Content but grant CoLearnerr a license to use it for Platform operations.</li>
            <li>Ownership rights may be affected by session agreements between users.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">9. Data Protection and Security</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>Your data is protected according to our Privacy Policy using encryption, secure access, and monitoring.</li>
            <li>
              Report any security issues to{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>{' '}
              immediately.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">10. Modifications and Termination</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>We may modify or discontinue Platform features. You will be notified of significant changes to these Terms.</li>
            <li>You may deactivate your account at any time via your account settings.</li>
            <li>We reserve the right to suspend or terminate accounts for violations, fraud, or misuse.</li>
            <li>Termination ends your access to the Platform but does not relieve you of outstanding dues.</li>
            <li>We are not liable for losses related to termination.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">11. Limitation of Liability</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>CoLearnerr is not liable for indirect damages, such as lost profits.</li>
            <li>Our total liability is limited to the amount you paid for the service.</li>
            <li>You agree to indemnify and cover losses if your actions cause claims or damages, including legal fees.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">12. Dispute Resolution</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>
              Attempt to resolve disputes by contacting{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>{' '}
              within 30 days.
            </li>
            <li>Unresolved disputes are governed by Indian law and subject to the jurisdiction of Hyderabad courts.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">13. Force Majeure</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            We are not liable for delays or failures due to events beyond our control, such as natural disasters, cyberattacks, or government actions.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">14. Miscellaneous</h2>
          <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
            <li>These Terms, together with the Privacy Policy, constitute the full agreement.</li>
            <li>If any part is found invalid, the rest remains unaffected.</li>
            <li>Our non-enforcement of rights does not waive them.</li>
            <li>You may not transfer these Terms without our consent; we may transfer them freely.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">15. Contact Information</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              For questions, contact us at:{' '}
              <a href="mailto:support@colearnerr.in" className="text-blue-600 hover:underline">
                support@colearnerr.in
              </a>
            </p>
            <p className="text-gray-600">Hyderabad, Telangana, India</p>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Questions or Feedback?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms or need clarification, our support team is here to help.
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

export default TermsPage;