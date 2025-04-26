import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { XMarkIcon } from '@heroicons/react/24/outline';

const pressMentionsData = [
  {
    id: 'streetwear-today',
    title: 'Dripster: The Future of Urban Style',
    date: 'March 15, 2025',
    excerpt: 'Our latest collection highlighted for its innovative designs and sustainable approach...',
    source: 'Streetwear Today Magazine',
    fullContent: (
      <div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Dripster: The Future of Urban Style</h3>
        <p className="text-gray-400 mb-2">Published in <span className="italic text-red-400">Streetwear Today Magazine</span></p>
        <p className="text-gray-400 mb-6">
          [Mimicked Content] Streetwear Today delves into Dripster's latest collection, highlighting its innovative designs and commitment to sustainable practices. The brand's unique approach to urban fashion is capturing the attention of style enthusiasts worldwide. Our founder, Satyam Rai, shares insights into the creative process and the brand's vision for the future.
        </p>
        <p className="text-gray-400 mb-6">
          The article praises Dripster's use of eco-friendly materials and ethical sourcing, setting a new standard in the industry. The featured collection showcases bold silhouettes, unique textures, and a vibrant color palette that resonates with the modern urban landscape.
        </p>
      </div>
    ),
  },
  {
    id: 'founder-interview',
    title: 'The Vision Behind Dripster: An Interview with Satyam Rai',
    date: 'February 28, 2025',
    excerpt: 'Learn about the journey and vision behind the Dripster brand...',
    source: 'Urban Fashion Blog',
    fullContent: (
      <div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">The Vision Behind Dripster</h3>
        <p className="text-gray-400 mb-2">An exclusive interview on <span className="italic text-blue-400">Urban Fashion Blog</span></p>
        <p className="text-gray-400 mb-6">
          [Mimicked Content] In this engaging interview, Satyam Rai, the founder of Dripster, shares the inspiring story of building the brand from the ground up in Gurugram, Haryana. He discusses the initial challenges, the core values that drive Dripster, and his aspirations for its growth in the global streetwear market.
        </p>
        <p className="text-gray-400 mb-6">
          Satyam emphasizes the importance of community and collaboration within the fashion industry, highlighting Dripster's partnerships with local artisans and designers. He also touches upon the brand's commitment to sustainability and ethical production.
        </p>
      </div>
    ),
  },
  {
    id: 'artist-collaboration',
    title: 'Dripster & Local Artists: A Fusion of Style',
    date: 'January 20, 2025',
    excerpt: 'Exciting collaboration showcasing unique designs inspired by local talent...',
    source: 'Dripster Official Press Release',
    fullContent: (
      <div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-4">Dripster & Local Artists: A Creative Partnership</h3>
        <p className="text-gray-400 mb-2">Official Press Release from <span className="italic text-green-400">Dripster</span></p>
        <p className="text-gray-400 mb-6">
          [Mimicked Content] Dripster is proud to announce its latest collaboration with a collective of talented local artists from across India. This initiative celebrates the fusion of diverse artistic expressions with Dripster's signature streetwear aesthetic, resulting in a limited-edition collection that is both unique and culturally resonant.
        </p>
        <p className="text-gray-400 mb-6">
          The press release details the inspiration behind the collaboration, featuring quotes from the artists and showcasing some of the key pieces in the collection. This partnership underscores Dripster's commitment to supporting local creative communities.
        </p>
      </div>
    ),
  },
];

const PressPage = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const handleReadMoreClick = (id: string) => {
    setSelectedArticleId(id);
  };

  const handleCloseFullContent = () => {
    setSelectedArticleId(null);
  };

  const selectedArticle = pressMentionsData.find(
    (article) => article.id === selectedArticleId
  );

  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Press - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Dripster in the News
        </h1>
        <p className="text-lg text-gray-400">
          Discover our features, interviews, and press releases.
        </p>
      </div>

      <section className="max-w-3xl mx-auto backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-red-500 mb-6">
          Press Mentions
        </h2>
        {pressMentionsData.length > 0 ? (
          <ul className="space-y-6">
            {pressMentionsData.map((mention) => (
              <li key={mention.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">{mention.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{mention.date} - <span className="italic">{mention.source}</span></p>
                <p className="text-gray-400 mb-2">{mention.excerpt}</p>
                <button
                  onClick={() => handleReadMoreClick(mention.id)}
                  className="text-red-400 hover:underline focus:outline-none"
                >
                  Read More
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No press mentions available at the moment. Stay tuned for updates!</p>
        )}
      </section>

      {selectedArticle && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="relative backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-90 rounded-lg shadow-xl p-8 max-w-3xl w-full m-4">
            <button
              onClick={handleCloseFullContent}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <h2 className="text-3xl font-bold text-red-500 mb-6">{selectedArticle.title}</h2>
            <p className="text-gray-400 text-sm mb-4">Published on {selectedArticle.date} by <span className="italic">{selectedArticle.source}</span></p>
            <div className="prose prose-sm md:prose text-gray-400">
              {selectedArticle.fullContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PressPage;