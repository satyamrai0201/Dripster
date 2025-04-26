import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

const PrivacyPolicyPage = () => {
  const lastUpdated = 'April 19, 2025';

  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Privacy Policy - Dripster</title>
        <meta name="description" content="Dripster's privacy policy outlining how we collect, use, and protect your personal information." />
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-400">Last updated: {lastUpdated}</p>
      </div>
      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">1. Information We Collect</h2>
        <p className="text-gray-400 mb-4">
          We collect several types of information to provide and improve our services:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-4">
          <li>**Personal Information:** This includes your name, email address, phone number, shipping address, billing address, and payment information when you create an account, place an order, or subscribe to our newsletter.</li>
          <li>**Account Information:** Your username and password (stored securely).</li>
          <li>**Order Information:** Details about the products you purchase, order history, and shipping details.</li>
          <li>**Device Information:** Information about your device, including IP address, browser type, operating system, and device identifiers.</li>
          <li>**Usage Information:** Data on how you use our website, including pages visited, products viewed, and search queries.</li>
          <li>**Cookies and Tracking Technologies:** We use cookies and similar technologies to track your activity on our website and collect certain information. You can manage your cookie preferences through your browser settings.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-400 mb-4">
          We use the collected information for various purposes, including:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-4">
          <li>To process and fulfill your orders, including shipping and payment processing.</li>
          <li>To manage your account and provide customer support.</li>
          <li>To personalize your experience on our website, such as recommending products you might like.</li>
          <li>To send you promotional emails, newsletters, and marketing communications (you can opt-out at any time).</li>
          <li>To improve our website, products, and services based on user behavior and feedback.</li>
          <li>To detect and prevent fraud and ensure the security of our website.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">3. Sharing Your Information</h2>
        <p className="text-gray-400 mb-4">
          We may share your information with third parties in the following circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-4">
          <li>**Service Providers:** We share information with third-party service providers who assist us with payment processing, shipping, marketing, data analysis, and website hosting. These providers are contractually obligated to protect your information.</li>
          <li>**Business Transfers:** In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity.</li>
          <li>**Legal Requirements:** We may disclose your information if required to do so by law or in response to a valid legal request.</li>
          <li>**With Your Consent:** We may share your information with third parties with your explicit consent.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">4. Data Security</h2>
        <p className="text-gray-400 mb-4">
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. These measures include encryption, secure storage, and regular security audits. However, no method of data transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">5. Your Rights</h2>
        <p className="text-gray-400 mb-4">
          Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, delete, or restrict the processing of your data. To exercise these rights, please contact us using the information provided below.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">6. Contact Us</h2>
        <p className="text-gray-400 mb-4">
          If you have any questions or concerns about our Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-400 mb-4">
          Dripster Customer Support<br/>
          [Your Business Address in India]<br/>
          Email: [Your Customer Support Email]<br/>
          Phone: [Your Customer Support Phone Number]
        </p>

        <Link to="/" className="text-red-400 hover:underline">Back to Home</Link>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;