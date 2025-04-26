import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

const TermsOfServicePage = () => {
  const lastUpdated = 'April 19, 2025';

  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Terms of Service - Dripster</title>
        <meta name="description" content="Dripster's terms of service outlining the rules and regulations for using our website." />
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Terms of Service</h1>
        <p className="text-lg text-gray-400">Last updated: {lastUpdated}</p>
      </div>
      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-400 mb-4">
          By accessing and using the Dripster website (the "Website"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use the Website.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">2. Use of the Website</h2>
        <p className="text-gray-400 mb-4">
          The Website is intended for personal, non-commercial use. You agree not to:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-4">
          <li>Use the Website for any illegal or unauthorized purpose.</li>
          <li>Interfere with or disrupt the operation of the Website or the servers and networks connected to it.</li>
          <li>Attempt to gain unauthorized access to any portion of the Website or any accounts, computer systems, or networks connected to the Website.</li>
          <li>Use any robot, spider, scraper, or other automated means to access the Website for any purpose without our express written permission.</li>
          <li>Transmit any viruses, worms, or other malicious code.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">3. Products and Pricing</h2>
        <p className="text-gray-400 mb-4">
          We strive to provide accurate product descriptions and pricing. However, errors may occur. We reserve the right to correct any errors in pricing or product information and to change prices at any time without notice. All orders are subject to availability.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">4. Orders and Payments</h2>
        <p className="text-gray-400 mb-4">
          By placing an order through our Website, you are offering to purchase products under these Terms. All orders are subject to acceptance by us. We may refuse to accept an order for any reason. Payment must be made through the methods specified on our Website.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">5. Shipping and Delivery</h2>
        <p className="text-gray-400 mb-4">
          Our shipping policies are outlined on our <Link to="/shipping" className="text-red-400 hover:underline">Shipping Information</Link> page. Please refer to that page for details on shipping costs, delivery times, and other related information.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">6. Intellectual Property</h2>
        <p className="text-gray-400 mb-4">
          All content on the Website, including text, graphics, logos, images, and software, is the property of Dripster or its licensors and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content from the Website without our express written permission.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">7. Disclaimer of Warranties</h2>
        <p className="text-gray-400 mb-4">
          The Website and all content, products, and services offered through it are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">8. Limitation of Liability</h2>
        <p className="text-gray-400 mb-4">
          To the fullest extent permitted by applicable law, Dripster shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Website or any products or services purchased through it.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">9. Governing Law</h2>
        <p className="text-gray-400 mb-4">
          These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">10. Changes to These Terms</h2>
        <p className="text-gray-400 mb-4">
          We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Website. Your continued use of the Website after the posting of revised Terms constitutes your acceptance of the changes.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">11. Contact Us</h2>
        <p className="text-gray-400 mb-4">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p className="text-gray-400 mb-4">
          Dripster Legal Department<br/>
          [Your Business Address in India]<br/>
          Email: [Your Legal Contact Email]
        </p>

        <Link to="/" className="text-red-400 hover:underline">Back to Home</Link>
      </section>
    </div>
  );
};

export default TermsOfServicePage;