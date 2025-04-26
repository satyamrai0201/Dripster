import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

const COMPANY_INFO = {
  address: '123 Tech Park, Electronic City Phase 1, Bangalore - 560100, India',
  email: 'support@dripster.com',
  phone: '+91 (800) 123-4567'
};

const ShippingPage: React.FC = () => {
  const lastUpdated = 'April 19, 2025';

  const deliveryTimes = [
    { type: 'Metro Cities', days: '2-4 business days' },
    { type: 'Tier 2 Cities', days: '3-6 business days' },
    { type: 'Other Locations', days: '5-8 business days' }
  ];

  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Shipping Information - Dripster</title>
        <meta name="description" content="Information about Dripster's shipping policies, costs, and delivery times within India." />
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Shipping Information</h1>
        <p className="text-lg text-gray-400">Last updated: {lastUpdated}</p>
      </div>
      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">1. Shipping Destinations</h2>
        <p className="text-gray-400 mb-4">
          We currently offer shipping to addresses within India. We are continuously evaluating our shipping capabilities and may expand to other regions in the future.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">2. Shipping Costs</h2>
        <p className="text-gray-400 mb-4">
          Shipping costs are calculated based on the weight of your order and your shipping destination within India. The exact shipping cost will be displayed at checkout before you complete your purchase. We may offer free shipping on orders that meet a certain value threshold. Please check our website banners and promotions for current offers.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">3. Estimated Delivery Times</h2>
        <p className="text-gray-400 mb-4">
          Delivery times vary depending on your location within India. The following are estimated delivery times after your order has been processed and shipped:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">
          {deliveryTimes.map(({ type, days }) => (
            <li key={type} className="flex items-start">
              <span className="font-medium text-gray-300">{type}:</span>
              <span className="ml-2">{days}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-400 mb-4">
          Please note that these are estimates, and actual delivery times may vary due to factors beyond our control, such as weather conditions, logistical issues, and public holidays.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">4. Order Processing Time</h2>
        <p className="text-gray-400 mb-4">
          We typically process orders within 1-2 business days after they are placed. Orders placed on weekends or public holidays will be processed on the next business day. You will receive a shipping confirmation email with tracking information once your order has been shipped.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">5. Shipping Carriers</h2>
        <p className="text-gray-400 mb-4">
          We partner with reputable courier services within India to ensure reliable and timely delivery of your orders. The specific carrier for your order will be indicated in your shipping confirmation email.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">6. Tracking Your Order</h2>
        <p className="text-gray-400 mb-4">
          Once your order has been shipped, you will receive an email containing your tracking number and a link to the carrier's website where you can track the progress of your delivery.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">7. Shipping Restrictions</h2>
        <p className="text-gray-400 mb-4">
          At this time, we do not ship to P.O. Boxes or APO/FPO addresses. Please provide a valid street address for shipping.
        </p>

        <h2 className="text-2xl font-semibold text-red-500 mb-4">8. Lost or Damaged Packages</h2>
        <p className="text-gray-400 mb-4">
          If your package is lost or arrives damaged, please contact our customer support team within 7 days of the delivery date so that we can assist you with a resolution. Please retain all packaging materials and damaged items for inspection.
        </p>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">
            Contact Information
          </h2>
          <div className="text-gray-400">
            <p className="mb-2">Dripster Customer Support</p>
            <p className="mb-2">{COMPANY_INFO.address}</p>
            <p className="mb-2">Email: {COMPANY_INFO.email}</p>
            <p className="mb-4">Phone: {COMPANY_INFO.phone}</p>
          </div>

          <Link href="/">
            <a className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShippingPage;