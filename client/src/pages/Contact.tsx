import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ContactUsPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <section className="backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold text-red-500 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-zinc-300">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-zinc-300">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 text-zinc-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                  placeholder="Subject"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-zinc-300">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400 h-32"
                  placeholder="Your message..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
              >
                Send Message
              </button>
            </form>
          </section>

          {/* Contact Information */}
          <section className="backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold text-red-500 mb-6 flex items-center space-x-2">
              <EnvelopeIcon className="h-6 w-6" />
              <span>Contact Information</span>
            </h2>
            <p className="text-gray-400 mb-6">
              You can also reach us through the following channels:
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-red-400" />
                <p className="text-gray-300">
                  Email: <a href="mailto:support@dripster.com" className="text-red-400 hover:underline">support@dripster.com</a>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-red-400" />
                <p className="text-gray-300">
                  Phone (India): <a href="tel:+91XXXXXXXXXX" className="text-red-400 hover:underline">+91 XXXXXXXXXX</a>
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Business Hours</h3>
              <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
              <p className="text-gray-400">Saturday: 10:00 AM - 4:00 PM IST</p>
              <p className="text-gray-400">Sunday: Closed</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;