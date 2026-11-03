export const phoneNumbers = ['9851189079', '9849911900'];
export const location = 'Dharmasthali, Kathmandu, Nepal';

export const divisions = [
  { title: 'Engineering Consultancy', path: '/engineering-consultancy', kicker: 'Plan with precision', description: 'Architectural, structural and technical expertise for confident building decisions.', image: 2, links: ['Architectural Drawing', 'Structural Design', '3D Design', 'Cost Estimation', 'Landscape Design', 'Building Analysis', 'Valuation'] },
  { title: 'Construction', path: '/construction', kicker: 'Build with confidence', description: 'Thoughtful execution for homes, commercial buildings and hospitality spaces.', image: 5, links: ['Residential Building', 'Commercial Building', 'Hotel & Resort', 'Party Palace', 'Apartments'] },
  { title: 'Real Estate', path: '/real-estate', kicker: 'Find your place', description: 'Land, buildings and lease opportunities, presented with clear information.', image: 4, links: ['Land & Building', 'Land Lease'] },
  { title: 'Furniture & Interior', path: '/furniture-interior', kicker: 'Live beautifully', description: 'Interior direction and furniture solutions shaped around the way you live.', image: 20, links: ['Korean Furniture', 'Luxury Furniture', 'Custom Furniture'] },
  { title: 'Import & Export', path: '/import-export', kicker: 'Materials with character', description: 'A considered range of architectural finishes and lighting, available by inquiry.', image: 9, links: ['Marble', 'Tiles', 'Chandeliers', 'Lighting'] },
  { title: 'Material Supply', path: '/material-supply', kicker: 'Supply the essentials', description: 'Construction materials sourced for projects across Kathmandu and beyond.', image: 16, links: ['Sand', 'Aggregate', 'Cement', 'Steel', 'Electrical', 'Sanitary'] },
];

export const services = [
  { title: 'Architectural Drawing', slug: 'architectural-drawing', parent: 'engineering-consultancy', description: 'Architectural planning and drawing services to help shape functional, well-considered spaces.' },
  { title: 'Structural Design', slug: 'structural-design', parent: 'engineering-consultancy', description: 'Structural planning and design support guided by project requirements and professional assessment.' },
  { title: '3D Design', slug: '3d-design', parent: 'engineering-consultancy', description: 'Three-dimensional architectural visualization to help you understand a design before it is built.' },
  { title: 'Cost Estimation', slug: 'cost-estimation', parent: 'engineering-consultancy', description: 'Preliminary construction budgeting support. Final estimates require project drawings, site conditions and current rates.' },
  { title: 'Landscape Design', slug: 'landscape-design', parent: 'engineering-consultancy', description: 'Landscape concepts that connect buildings with outdoor spaces and their surroundings.' },
  { title: 'Building Analysis', slug: 'building-analysis', parent: 'engineering-consultancy', description: 'Building review and analysis tailored to a property’s condition and project brief.' },
  { title: 'Valuation', slug: 'valuation', parent: 'engineering-consultancy', description: 'Property valuation services arranged around the purpose and scope of your assessment.' },
  ...[
    ['Residential Building', 'residential-building'], ['Commercial Building', 'commercial-building'], ['Hotel & Resort', 'hotel-resort'], ['Party Palace', 'party-palace'], ['Apartments', 'apartments'],
  ].map(([title, slug]) => ({ title, slug, parent: 'construction', description: `Construction planning and delivery for ${title.toLowerCase()} projects.` })),
  ...[
    ['Land & Building', 'land-building'], ['Land Lease', 'land-lease'],
  ].map(([title, slug]) => ({ title, slug, parent: 'real-estate', description: `Speak with Shivapuri Group about ${title.toLowerCase()} opportunities. Availability and terms are confirmed on inquiry.` })),
  ...[
    ['Korean Furniture', 'korean-furniture'], ['Luxury Furniture', 'luxury-furniture'], ['Custom Furniture', 'custom-furniture'],
  ].map(([title, slug]) => ({ title, slug, parent: 'furniture-interior', description: `${title} inquiries are welcomed. Product availability, materials and customization are confirmed directly.` })),
  ...[
    ['Marble', 'marble'], ['Tiles', 'tiles'], ['Chandeliers', 'chandeliers'], ['Lighting', 'lighting'],
  ].map(([title, slug]) => ({ title, slug, parent: 'import-export', description: `Request current options and specifications for ${title.toLowerCase()} through our team.` })),
  ...[
    ['Sand', 'sand'], ['Aggregate', 'aggregate'], ['Cement', 'cement'], ['Steel', 'steel'], ['Electrical Materials', 'electrical'], ['Sanitary Materials', 'sanitary'],
  ].map(([title, slug]) => ({ title, slug, parent: 'material-supply', description: `Ask our team about ${title.toLowerCase()} availability, specifications and quotation.` })),
];

export const projects = Array.from({ length: 48 }, (_, i) => ({
  slug: `completed-project-${String(i + 1).padStart(2, '0')}`,
  title: 'Completed project',
  image: `/images/projects/residential-visual-${String(i + 1).padStart(2, '0')}.jpeg`,
  category: 'Completed by Shivapuri Group',
}));
