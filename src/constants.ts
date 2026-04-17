import { Category, SMMService } from './types';

export const CATEGORIES: Category[] = [
  { id: 'tg-members', name: 'Telegram Members', icon: 'Send', platform: 'telegram' },
  { id: 'fb-followers', name: 'Facebook Followers', icon: 'Facebook', platform: 'facebook' },
  { id: 'ig-followers', name: 'Instagram Followers', icon: 'Instagram', platform: 'instagram' },
  { id: 'tt-views', name: 'TikTok Views', icon: 'Video', platform: 'tiktok' },
  { id: 'yt-subs', name: 'YouTube Subscribers', icon: 'Youtube', platform: 'youtube' },
  { id: 'tw-followers', name: 'Twitter Followers', icon: 'Twitter', platform: 'twitter' },
];

export const SERVICES: SMMService[] = [
  {
    id: '1',
    category: 'tg-members',
    name: 'Real Telegram Channel Members',
    pricePer1000: 2.5,
    min: 100,
    max: 50000,
    description: 'High quality members with low drop rate.',
    platform: 'telegram'
  },
  {
    id: '2',
    category: 'fb-followers',
    name: 'Facebook Page Followers (Non-drop)',
    pricePer1000: 3.2,
    min: 500,
    max: 100000,
    description: 'Real looking profiles, high retention.',
    platform: 'facebook'
  },
  {
    id: '3',
    category: 'ig-followers',
    name: 'Instagram Followers (Fast)',
    pricePer1000: 1.8,
    min: 100,
    max: 200000,
    description: 'Instant delivery, mixed quality.',
    platform: 'instagram'
  },
  {
    id: '4',
    category: 'tt-views',
    name: 'TikTok Video Views',
    pricePer1000: 0.1,
    min: 1000,
    max: 1000000,
    description: 'Super fast delivery, stable views.',
    platform: 'tiktok'
  },
  {
    id: '5',
    category: 'yt-subs',
    name: 'YouTube Subscribers (Natural)',
    pricePer1000: 15.0,
    min: 100,
    max: 10000,
    description: 'Slow feed to avoid removal by YT.',
    platform: 'youtube'
  }
];
