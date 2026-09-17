/**
 * Site Configuration & External Links
 *
 * Customize your social media links, sponsor details, and admin defaults here.
 * You can also override these via environment variables in .env.local.
 */
export const siteConfig = {
  name: "KMCLU Confessions",
  tagline: "Say It. Leave It. Let It Float.",
  description: "The anonymous digital corkboard for KMCLU campus secrets, crushes, and confessions.",
  
  // Sponsor Details
  sponsor: {
    name: "ilham chikankari",
    url: process.env.NEXT_PUBLIC_SPONSOR_URL || "https://www.instagram.com/ilhamchikankari/",
    description: "Authentic Handcrafted Lucknowi Chikankari Wear",
  },

  // Social Media Links
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
    discord: process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://chat.whatsapp.com/",
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/",
  },

  // Campus Community
  community: {
    label: "KMCLU Students",
    url: process.env.NEXT_PUBLIC_COMMUNITY_URL || "https://www.instagram.com/",
  },
};
