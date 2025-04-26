import React from 'react';
import { Helmet } from 'react-helmet';
import { MapPinIcon } from '@heroicons/react/24/outline'; // Icon for store location

const FindAStorePage = () => {
  // Replace with your actual store data
  const stores = [
    {
      name: 'Dripster Mumbai',
      address: '123 Fashion Street, Fort, Mumbai - 400001',
      phone: '+91 22 XXXXXXXX',
      timing: 'Mon-Sun: 10 AM - 9 PM',
    },
    {
      name: 'Dripster Delhi',
      address: '456 Urban Avenue, Connaught Place, New Delhi - 110001',
      phone: '+91 11 YYYYYYYY',
      timing: 'Mon-Sun: 11 AM - 8 PM',
    },
    {
      name: 'Dripster Bangalore',
      address: '789 Style Road, Indiranagar, Bangalore - 560038',
      phone: '+91 80 ZZZZZZZZ',
      timing: 'Mon-Sun: 10:30 AM - 9:30 PM',
    },
    // Add more store locations here
  ];

  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Find a Store - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Find Your Nearest Dripster Store
        </h1>
        <p className="text-lg text-gray-400">
          Visit us in person to experience the latest streetwear collections.
        </p>
      </div>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6 flex items-center space-x-2">
          <MapPinIcon className="h-6 w-6" />
          <span>Our Store Locations in India</span>
        </h2>
        {stores.length > 0 ? (
          <ul className="space-y-6">
            {stores.map((store, index) => (
              <li key={index} className="border-b border-gray-700 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{store.name}</h3>
                <p className="text-gray-400 mb-1">{store.address}</p>
                <p className="text-gray-400 mb-1">Phone: <a href={`tel:${store.phone}`} className="text-red-400 hover:underline">{store.phone}</a></p>
                <p className="text-gray-400">Timings: {store.timing}</p>
                {/* You could potentially add a "Get Directions" link here using a map service */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">We currently do not have any physical stores in your region. Stay tuned for updates!</p>
        )}
      </section>

      {/* You could integrate a map component here if you have one and want to visually show locations */}
      {/* <section className="mt-8 max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6">
          Store Map
        </h2>
        {/* Your map component would go here */}
      {/* </section> */}
    </div>
  );
};

export default FindAStorePage;