// Everything an admin might need to change (contact details, bank accounts, headline
// numbers) lives here. After editing, run `npm run release` and re-upload.

export const site = {
  name: 'iLead Youth Empower Africa Network',
  short: 'iLead',
  tagline: 'Building a generation for excellence',
  url: 'https://ileadyouthempowerafrica.com.ng',
  cac: 'RC 7206456',
  registered: '2 November 2023',
  founded: 2018,

  email: 'info@ileadyouthempowerafrica.com.ng',
  address: ['22, Makinde Street, Alausa', 'Ikeja, Lagos, Nigeria'],
  mapQuery: '22 Makinde Street, Alausa, Ikeja, Lagos, Nigeria',
  phones: [
    { label: '0816 658 5345', tel: '+2348166585345' },
    { label: '0806 819 7036', tel: '+2348068197036' },
  ],

  social: [
    { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/Globalyouthsinitiativ?mibextid=ZbWKwL' },
    { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/ilead_youthempowerafricanetwk?igsh=cjI3dzRmaTFwOHBy' },
    { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@ILeadYouthTV' },
    // TODO: replace these two search links with the exact profile URLs (e.g. https://www.linkedin.com/company/...)
    { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/search/results/companies/?keywords=iLead%20Youth%20Empower%20Africa%20Network' },
    { key: 'twitter', label: 'X (Twitter)', href: 'https://x.com/search?q=iLead%20Youth%20Empower%20Africa%20Network&f=user' },
  ],

  accounts: [
    { currency: 'NGN', label: 'Naira account', number: '1028679904' },
    { currency: 'USD', label: 'Dollar account', number: '3004935277' },
  ],
  bank: 'UBA (United Bank for Africa)',
  accountName: 'ILEAD YOUTH EMPOWER AFRICA NETWORK',
};

// Headline impact numbers (counted up on the home page).
export const stats = [
  { value: 3200, suffix: '+', label: 'Students reached', note: 'primary & secondary pupils' },
  { value: 6, suffix: '', label: 'States in Nigeria', note: 'rural & underserved communities' },
  { value: 7, suffix: '', label: 'School outreaches', note: 'and counting' },
  { value: 2018, suffix: '', label: 'Year founded', note: 'CAC registered 2023', plain: true },
];

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Our Team' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];
