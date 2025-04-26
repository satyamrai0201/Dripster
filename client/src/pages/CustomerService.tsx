import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnvelopeIcon, PhoneIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'; // Assuming you use Heroicons

const CustomerServicePage = () => {
  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Customer Service - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Need Assistance? We're Here to Help.
        </h1>
        <p className="text-lg text-gray-400">
          Explore our FAQs or reach out to our friendly support team for any queries.
        </p>
      </div>

      <section className="mb-10 backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6 flex items-center space-x-2">
          <QuestionMarkCircleIcon className="h-6 w-6" />
          <span>Frequently Asked Questions</span>
        </h2>
        <Accordion className="w-full" type="multiple">
          <AccordionItem value="order-status" className="border-b border-gray-700 last:border-b-0">
            <AccordionTrigger className="py-4 font-medium text-gray-300 hover:text-red-400">
              Where is my order?
            </AccordionTrigger>
            <AccordionContent className="py-3 text-gray-400">
              You can easily track your order by logging into your Dripster account and visiting the 'Order History' section. Once your package is on its way, we'll send you a tracking number via email.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns" className="border-b border-gray-700 last:border-b-0">
            <AccordionTrigger className="py-4 font-medium text-gray-300 hover:text-red-400">
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent className="py-3 text-gray-400">
              We want you to love your Dripster gear! If for any reason you're not satisfied, we offer a return window of [Number] days. Please see our detailed Returns & Exchanges page for more information.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-methods" className="border-b border-gray-700 last:border-b-0">
            <AccordionTrigger className="py-4 font-medium text-gray-300 hover:text-red-400">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="py-3 text-gray-400">
              We accept a variety of secure payment options, including major credit/debit cards (Visa, Mastercard, Amex), UPI, Net Banking, and popular digital wallets. COD may be available in select locations.
            </AccordionContent>
          </AccordionItem>
          {/* Add more FAQ items here */}
        </Accordion>
      </section>

      <section className="mb-10 backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6 flex items-center space-x-2">
          <EnvelopeIcon className="h-6 w-6" />
          <span>Contact Our Support Team</span>
        </h2>
        <p className="text-gray-400 mb-4">
          Our dedicated team is ready to assist you. Reach out through the channels below:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="py-4">
            <h3 className="text-xl font-semibold text-gray-300 mb-2 flex items-center space-x-2">
              <EnvelopeIcon className="h-5 w-5 text-red-400" />
              <span>Email Us</span>
            </h3>
            <p className="text-gray-400">
              For general inquiries, drop us an email at:
              <a href="mailto:support@dripster.com" className="text-red-400 hover:underline ml-1">support@dripster.com</a>
            </p>
          </div>
          <div className="py-4">
            <h3 className="text-xl font-semibold text-gray-300 mb-2 flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-red-400" />
              <span>Call Us (India)</span>
            </h3>
            <p className="text-gray-400">
              Our phone support is available Monday to Friday, 9 AM to 6 PM IST.
            </p>
            <p className="text-gray-400">
              Phone: <a href="tel:+91XXXXXXXXXX" className="text-red-400 hover:underline ml-1">+91 XXXXXXXXXX</a>
            </p>
          </div>
          {/* Add other contact methods like live chat here */}
        </div>
      </section>

      <section className="backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6">
          Send Us a Message
        </h2>
        <p className="text-gray-400 mb-4">
          Have a specific question or concern? Use the form below to send us a direct message. We'll get back to you as soon as possible.
        </p>
        <form className="max-w-lg mx-auto">
          <div className="mb-4">
            <Label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Your Name
            </Label>
            <Input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-700 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Your Email
            </Label>
            <Input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-700 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
              Message
            </Label>
            <textarea
              id="message"
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-700 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your message"
            />
          </div>
          <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
            Submit Message
          </Button>
        </form>
      </section>
    </div>
  );
};

export default CustomerServicePage;