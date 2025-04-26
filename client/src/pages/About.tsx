import React from 'react';
import { Helmet } from 'react-helmet';

const OurStoryPage = () => {
  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Our Story - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          The Dripster Journey
        </h1>
        <p className="text-lg text-gray-400">
          How Dripster came to be and our passion for streetwear.
        </p>
      </div>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Our Humble Beginnings</h2>
        <p className="text-gray-400 mb-4">
          Dripster was founded in 2025 by Satyam Rai in Gurugram, Haryana. Recognizing a gap in the local fashion scene for truly unique and expressive streetwear, Satyam envisioned a platform that would cater to individuals seeking to stand out through their style.
        </p>
        <p className="text-gray-400 mb-4">
          Starting as a small online venture, Dripster focused on curating a collection of independent designers and hard-to-find pieces that resonated with those looking to express their individuality through clothing.
        </p>
      </section>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Our Vision</h2>
        <p className="text-gray-400 mb-4">
          Our vision at Dripster is to be more than just a retailer. We aim to be a cultural hub for the streetwear community in India and beyond, fostering creativity, individuality, and self-expression. We believe that clothing is a powerful form of communication and a way to connect with like-minded individuals.
        </p>
        <p className="text-gray-400">
          We are committed to continuously sourcing unique and high-quality garments, supporting emerging talent, and providing an exceptional shopping experience for our customers across India.
        </p>
      </section>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">The Future of Dripster</h2>
        <p className="text-gray-400">
          As we look to the future, Dripster is excited to expand our reach within India, collaborate with more local artists and designers, and further engage with our community through events and online platforms. Our journey is just beginning, and we invite you to be a part of the Dripster story.
        </p>
      </section>
    </div>
  );
};

export default OurStoryPage;