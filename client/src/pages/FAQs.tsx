import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import {
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  CreditCardIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface FaqCategory {
  title: string;
  description: string;
  icon: React.ComponentType<React.ComponentProps<'svg'>>;
  link: string;
}

const FAQsPage: React.FC = () => {
  const [_, setLocation] = useLocation();

  const faqCategories: FaqCategory[] = [
    {
      title: 'Orders & Shipping',
      description: 'Questions about placing orders, shipping details, and tracking.',
      icon: EnvelopeIcon,
      link: '/customer-service/orders-shipping',
    },
    {
      title: 'Returns & Exchanges',
      description: 'Information regarding our return and exchange policies.',
      icon: ArrowRightIcon,
      link: '/customer-service/returns-exchanges',
    },
    {
      title: 'Payments & Billing',
      description: 'Queries related to payment methods, billing issues, and refunds.',
      icon: CreditCardIcon,
      link: '/customer-service/payments-billing',
    },
    {
      title: 'Account & Profile',
      description: 'Questions about managing your Dripster account.',
      icon: QuestionMarkCircleIcon,
      link: '/customer-service/account-profile',
    },
  ];

  const handleCategoryClick = (link: string) => {
    setLocation(link);
  };

  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Frequently Asked Questions - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-400">
          Find answers to common questions about Dripster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {faqCategories.map((category) => (
          <div
            key={category.title}
            onClick={() => handleCategoryClick(category.link)}
            className="backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-md p-6 hover:bg-gray-700 border border-gray-700 transition duration-200 cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <category.icon className="h-8 w-8 text-red-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-300">{category.title}</h2>
            </div>
            <p className="text-gray-400 mb-2">{category.description}</p>
            <span className="text-red-400 hover:underline flex items-center">
              Learn More <ArrowRightIcon className="h-4 w-4 ml-1" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsPage;