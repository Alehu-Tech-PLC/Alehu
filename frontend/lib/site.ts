export const site = {
  name: 'Alehu Technologies',
  legalName: 'Alehu Technologies PLC',
  tagline: 'Smart child safety systems',
  description:
    'Alehu AI protects children with a non-intrusive wearable, on-device edge AI, and instant guardian alerts. Privacy-first safety for homes, schools, and cities.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'en_ET',
  city: 'Addis Ababa, Ethiopia',
  email: 'contact@alehu.ai',
  partnerships: 'partnerships@alehu.ai',
  investors: 'ir@alehu.ai',
  keywords: [
    'child safety wearable',
    'edge AI',
    'geofencing for kids',
    'fall detection',
    'silent SOS',
    'Alehu AI',
    'Ethiopia',
  ],
};

export const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
