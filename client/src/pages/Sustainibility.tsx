import React from 'react';
import { Helmet } from 'react-helmet';
import { AcademicCapIcon as LeafIcon, ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline';

const SustainabilityPage = () => {
  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Sustainability - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Our Commitment to Sustainability
        </h1>
        <p className="text-lg text-gray-400">
          Learn about Dripster's efforts towards a more sustainable future.
        </p>
      </div>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700 mb-8">
        <div className="flex items-center mb-4">
          <LeafIcon className="h-8 w-8 text-red-400 mr-3" />
          <h2 className="text-2xl font-semibold text-red-500">Ethical Sourcing</h2>
        </div>
        <p className="text-gray-400 mb-4">
          We are committed to sourcing our materials from suppliers who adhere to ethical labor practices and environmental standards. We prioritize working with partners who share our values and strive for transparency in their supply chains.
        </p>
        {/* Add more details about ethical sourcing */}
      </section>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700 mb-8">
        <div className="flex items-center mb-4">
          <RefreshIcon className="h-8 w-8 text-red-400 mr-3" />
          <h2 className="text-2xl font-semibold text-red-500">Reducing Our Environmental Impact</h2>
        </div>
        <p className="text-gray-400 mb-4">
          Dripster is actively working to minimize our environmental footprint through various initiatives, such as reducing waste in our packaging, exploring eco-friendly materials, and optimizing our logistics to lower carbon emissions.
        </p>
        {/* Add more details about environmental impact reduction */}
      </section>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Sustainable Products</h2>
        <p className="text-gray-400 mb-4">
          We are continuously expanding our collection of sustainable products, including items made from organic cotton, recycled materials, and innovative eco-conscious fabrics. Look for our "Sustainable Choice" tag while browsing our shop.
        </p>
        {/* Add examples of sustainable products */}
      </section>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Our Future Goals</h2>
        <p className="text-gray-400">
          We recognize that sustainability is an ongoing journey. Dripster is committed to setting ambitious goals for the future, including [mention specific future goals related to sustainability]. We will continue to transparently share our progress and strive for a more sustainable future for the fashion industry.
        </p>
      </section>
    </div>
  );
};

export default SustainabilityPage;