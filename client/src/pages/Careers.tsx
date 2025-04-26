import React from 'react';
import { Helmet } from 'react-helmet';
import Founder from 'generated-icon.png';

// Sample team member data (replace with your actual team)
const teamMembers = [
  {
    name: 'Satyam Rai',
    title: 'Founder & CEO',
    imageUrl: "https://ugazhxyirbgmepggmkqn.supabase.co/storage/v1/object/public/assets/team/ceo.jpg",
    bio: 'A visionary leader with a passion for streetwear and community building.',
  },
  {
    name: 'Prashant Kumar',
    title: 'Head of Design',
    imageUrl: 'https://ugazhxyirbgmepggmkqn.supabase.co/storage/v1/object/public/assets/team/head-design.jpg',
    bio: 'Creative mind behind our unique collections, always pushing the boundaries of style.',
  },
  {
    name: 'Prithvi Raj',
    title: 'Chief Technology Officer',
    imageUrl: 'https://ugazhxyirbgmepggmkqn.supabase.co/storage/v1/object/public/assets/team/cto.jpg',
    bio: 'Tech innovator driving digital transformation and enhancing the online shopping experience.',
  },
  {
    name: 'Atharva Mishra',
    title: 'Marketing Manager',
    imageUrl: 'https://ugazhxyirbgmepggmkqn.supabase.co/storage/v1/object/public/assets/team/marketing.jpg',
    bio: 'Responsible for sharing the Dripster story and connecting with our audience.',
  },
];

const TeamMemberCard = ({ member }: { member: typeof teamMembers[0] }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-30 rounded-lg shadow-md p-6 border border-gray-700 text-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
        {imageError ? (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">{member.name[0]}</span>
          </div>
        ) : (
          <img 
            src={member.imageUrl} 
            alt={member.name} 
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <h3 className="text-xl font-semibold text-red-500 mb-2">{member.name}</h3>
      <p className="text-gray-300 mb-2">{member.title}</p>
      <p className="text-gray-400 text-sm">{member.bio}</p>
    </div>
  );
};

const OurTeamPage = () => {
  return (
    <div className="bg-black-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Helmet>
        <title>Our Team - Dripster</title>
      </Helmet>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Meet the Dripster Crew
        </h1>
        <p className="text-lg text-gray-400">
          The passionate individuals behind the Dripster experience.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeamPage;