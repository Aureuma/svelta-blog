import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const pages: Record<
  string,
  {
    title: string;
    description: string;
    status?: string;
  }
> = {
  about: {
    title: 'About Convelt',
    description: 'We build AI-enhanced websites that fit into busy schedules.',
    status: 'Coming soon'
  },
  careers: {
    title: 'Careers',
    description: 'Join the team shaping SMB web automation.',
    status: 'Coming soon'
  },
  press: {
    title: 'Press & Media',
    description: 'Press resources and brand assets for Convelt.',
    status: 'Coming soon'
  },
  security: {
    title: 'Security',
    description: 'Our commitment to secure publishing and data handling.',
    status: 'Coming soon'
  },
  guides: {
    title: 'Guides',
    description: 'Step-by-step playbooks for SMB website launches.',
    status: 'Coming soon'
  },
  support: {
    title: 'Support',
    description: 'Get help with your Convelt site.',
    status: 'Coming soon'
  },
  changelog: {
    title: 'Changelog',
    description: 'What’s new in Convelt.',
    status: 'Coming soon'
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Convelt handles and protects your data.',
    status: 'Coming soon'
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms and conditions for using Convelt.',
    status: 'Coming soon'
  },
  'platform-rules': {
    title: 'Platform Rules',
    description: 'Guidelines for content and usage on Convelt.',
    status: 'Coming soon'
  },
  abuse: {
    title: 'Report abuse',
    description: 'Report content or behavior that violates our rules.',
    status: 'Coming soon'
  },
  templates: {
    title: 'Templates',
    description: 'Curated layouts for high-converting SMB websites.',
    status: 'Beta'
  },
  beta: {
    title: 'Beta access',
    description: 'Early access to Convelt’s site builder and concierge tools.',
    status: 'Beta'
  }
};

export const load: PageServerLoad = async ({ params }) => {
  const page = pages[params.slug];
  if (!page) {
    throw error(404, 'Page not found');
  }

  return {
    slug: params.slug,
    ...page
  };
};
