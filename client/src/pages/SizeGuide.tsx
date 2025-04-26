import React from 'react';
import { Helmet } from 'react-helmet';

const SizeGuidePage = () => {
  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Size Guide - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Find Your Perfect Fit
        </h1>
        <p className="text-lg text-gray-400">
          Refer to our size charts below for accurate measurements.
        </p>
      </div>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6">
          Apparel Size Guide (in cm)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2 text-left text-gray-300">Size</th>
                <th className="border border-gray-700 px-4 py-2 text-left text-gray-300">Chest (cm)</th>
                <th className="border border-gray-700 px-4 py-2 text-left text-gray-300">Waist (cm)</th>
                <th className="border border-gray-700 px-4 py-2 text-left text-gray-300">Hips (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-400">S</td>
                <td className="px-4 py-2 text-gray-400">86-91</td>
                <td className="px-4 py-2 text-gray-400">71-76</td>
                <td className="px-4 py-2 text-gray-400">91-97</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-400">M</td>
                <td className="px-4 py-2 text-gray-400">97-102</td>
                <td className="px-4 py-2 text-gray-400">81-86</td>
                <td className="px-4 py-2 text-gray-400">102-107</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-400">L</td>
                <td className="px-4 py-2 text-gray-400">107-112</td>
                <td className="px-4 py-2 text-gray-400">91-97</td>
                <td className="px-4 py-2 text-gray-400">107-112</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-400">XL</td>
                <td className="px-4 py-2 text-gray-400">112-117</td>
                <td className="px-4 py-2 text-gray-400">102-107</td>
                <td className="px-4 py-2 text-gray-400">112-117</td>
              </tr>
              {/* Add more sizes as needed */}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-gray-400">
          Please note that these are general guidelines, and measurements may vary slightly depending on the specific garment. Refer to the product description for more detailed sizing information.
        </p>
      </section>

      {/* You can add more size charts for different product categories (e.g., shoes, accessories) */}
      {/* <section className="mt-8 max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6">
          Footwear Size Guide (in UK)
        </h2>
        {/* Add footwear size chart here */}
      {/* </section> */}
    </div>
  );
};

export default SizeGuidePage;