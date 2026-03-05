import { Property, Tenant, Landlord, SupportTicket, PlatformMetrics, Lead, Subscription, Conversation, InternalUser, LeadSegment } from './types';

export const INTERNAL_USERS: InternalUser[] = [
  { id: 'u-1', name: 'Alex Thompson', email: 'alex.t@homigo.com', role: 'Super Admin', status: 'Active', lastActive: '2024-02-26 14:30' },
  { id: 'u-2', name: 'Sarah Miller', email: 'sarah.m@homigo.com', role: 'Editor', status: 'Active', lastActive: '2024-02-26 12:15' },
  { id: 'u-3', name: 'James Chen', email: 'james.c@homigo.com', role: 'Viewer', status: 'Active', lastActive: '2024-02-25 09:45' },
  { id: 'u-4', name: 'Emma Davis', email: 'emma.d@homigo.com', role: 'Admin', status: 'Inactive', lastActive: '2024-02-10 16:20' },
];

export const LANDLORDS: Landlord[] = [
  {
    id: 'l-1',
    name: 'Robert Sterling',
    email: 'robert@sterlingproperties.com',
    phone: '(555) 010-2233',
    totalProperties: 12,
    status: 'Verified',
    joinedDate: '2023-05-12',
    kycStatus: 'Verified',
    documents: [
      { id: 'doc-1', type: 'ID', url: 'https://picsum.photos/seed/id1/200/300', status: 'Approved', uploadedAt: '2023-05-10' }
    ]
  },
  {
    id: 'l-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@urbanliving.io',
    phone: '(555) 010-4455',
    totalProperties: 5,
    status: 'Pending',
    joinedDate: '2024-01-20',
    kycStatus: 'Pending',
    documents: [
      { id: 'doc-2', type: 'ID', url: 'https://picsum.photos/seed/id2/200/300', status: 'Pending', uploadedAt: '2024-01-20' },
      { id: 'doc-3', type: 'Business License', url: 'https://picsum.photos/seed/lic1/200/300', status: 'Pending', uploadedAt: '2024-01-20' }
    ]
  },
  {
    id: 'l-3',
    name: 'Global Realty Group',
    email: 'ops@globalrealty.com',
    phone: '(555) 010-8899',
    totalProperties: 45,
    status: 'Verified',
    joinedDate: '2022-11-05',
    kycStatus: 'Verified',
  },
];

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    landlordId: 'l-1',
    name: 'Skyline Heights',
    address: '123 Downtown Ave, Metropolis',
    type: 'Apartment',
    status: 'Published',
    verificationStatus: 'Verified',
    rent: 2500,
    commissionRate: 0.08,
    image: 'https://picsum.photos/seed/prop1/400/300',
  },
  {
    id: 'prop-2',
    landlordId: 'l-2',
    name: 'Green Valley Villa',
    address: '456 Suburbia Ln, Springfield',
    type: 'House',
    status: 'Under Review',
    verificationStatus: 'Pending',
    rent: 3800,
    commissionRate: 0.10,
    image: 'https://picsum.photos/seed/prop2/400/300',
    documents: [
      { id: 'doc-4', type: 'Proof of Ownership', url: 'https://picsum.photos/seed/own1/200/300', status: 'Pending', uploadedAt: '2024-01-21' }
    ]
  },
  {
    id: 'prop-3',
    landlordId: 'l-1',
    name: 'Urban Loft',
    address: '789 Industrial Way, Gotham',
    type: 'Studio',
    status: 'Published',
    verificationStatus: 'Verified',
    rent: 1800,
    commissionRate: 0.08,
    image: 'https://picsum.photos/seed/prop3/400/300',
  },
];

export const TENANTS: Tenant[] = [
  {
    id: 't-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '(555) 123-4567',
    propertyId: 'prop-1',
    status: 'Active',
    kycStatus: 'Verified',
    documents: [
      { id: 'doc-5', type: 'ID', url: 'https://picsum.photos/seed/id3/200/300', status: 'Approved', uploadedAt: '2023-01-10' }
    ]
  },
  {
    id: 't-2',
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    phone: '(555) 987-6543',
    propertyId: 'prop-3',
    status: 'Active',
    kycStatus: 'Pending',
    documents: [
      { id: 'doc-6', type: 'ID', url: 'https://picsum.photos/seed/id4/200/300', status: 'Pending', uploadedAt: '2023-06-01' }
    ]
  },
];

export const LEAD_SEGMENTS: LeadSegment[] = [
  { id: 'seg-1', name: 'High Value', description: 'Leads with score > 80', color: 'emerald', count: 3 },
  { id: 'seg-2', name: 'Stale', description: 'No activity for 7 days', color: 'amber', count: 1 },
  { id: 'seg-3', name: 'New Inbound', description: 'Created in last 24h', color: 'blue', count: 2 },
];

export const LEADS: Lead[] = [
  {
    id: 'ld-1',
    name: 'James Wilson',
    email: 'james.w@example.com',
    phone: '(555) 000-1111',
    company: 'Wilson & Co',
    score: 85,
    source: 'Website',
    type: 'Tenant',
    status: 'New',
    interestedIn: 'Downtown Area',
    tags: ['VIP', 'Urgent'],
    segment: 'seg-1',
    createdAt: '2024-02-25',
  },
  {
    id: 'ld-2',
    name: 'Emily Chen',
    email: 'emily.c@example.com',
    phone: '(555) 000-2222',
    company: 'Urban Living',
    score: 92,
    source: 'Social Media',
    type: 'Landlord',
    status: 'Contacted',
    interestedIn: 'Listing 5 properties',
    tags: ['Investor', 'Referral'],
    segment: 'seg-1',
    createdAt: '2024-02-24',
  },
  {
    id: 'ld-3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '(555) 000-3333',
    company: 'Brown Estates',
    score: 45,
    source: 'Referral',
    type: 'Tenant',
    status: 'Qualified',
    interestedIn: 'Skyline Heights',
    tags: ['Family'],
    segment: 'seg-2',
    createdAt: '2024-02-23',
  },
  {
    id: 'ld-4',
    name: 'Sarah Miller',
    email: 'sarah.m@miller.io',
    phone: '(555) 000-4444',
    company: 'Miller Tech',
    score: 78,
    source: 'Direct',
    type: 'Tenant',
    status: 'New',
    interestedIn: 'Modern Loft',
    tags: ['Tech'],
    segment: 'seg-3',
    createdAt: '2024-02-26',
  },
  {
    id: 'ld-5',
    name: 'David Thompson',
    email: 'd.thompson@global.com',
    phone: '(555) 000-5555',
    company: 'Global Holdings',
    score: 65,
    source: 'Website',
    type: 'Landlord',
    status: 'New',
    interestedIn: 'Portfolio Management',
    tags: ['Corporate'],
    segment: 'seg-3',
    createdAt: '2024-02-27',
  },
  {
    id: 'ld-6',
    name: 'Jessica Lee',
    email: 'j.lee@creative.co',
    phone: '(555) 000-6666',
    company: 'Creative Spaces',
    score: 88,
    source: 'Referral',
    type: 'Tenant',
    status: 'Contacted',
    interestedIn: 'Studio Apartment',
    tags: ['Artist'],
    segment: 'seg-1',
    createdAt: '2024-02-28',
  },
];

export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    landlordId: 'l-1',
    plan: 'Pro',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: 99,
    nextBillingDate: '2024-03-15',
  },
  {
    id: 'sub-2',
    landlordId: 'l-2',
    plan: 'Basic',
    status: 'Active',
    billingCycle: 'Yearly',
    amount: 499,
    nextBillingDate: '2025-01-20',
  },
  {
    id: 'sub-3',
    landlordId: 'l-3',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: 499,
    nextBillingDate: '2024-03-05',
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      { id: 'l-1', name: 'Robert Sterling', role: 'Landlord' },
      { id: 't-1', name: 'Alice Johnson', role: 'Tenant' }
    ],
    lastMessage: 'When can I move in?',
    updatedAt: '2024-02-26 10:30 AM',
    status: 'Active',
    messages: [
      { id: 'm-1', senderId: 'l-1', senderName: 'Robert Sterling', content: 'The property is ready for viewing tomorrow.', timestamp: '2024-02-26 10:15 AM', isFlagged: false },
      { id: 'm-2', senderId: 't-1', senderName: 'Alice Johnson', content: 'Great! When can I move in?', timestamp: '2024-02-26 10:30 AM', isFlagged: false }
    ]
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'l-2', name: 'Sarah Jenkins', role: 'Landlord' },
      { id: 't-2', name: 'Bob Smith', role: 'Tenant' }
    ],
    lastMessage: 'Please send your bank details directly to my email.',
    updatedAt: '2024-02-26 09:45 AM',
    status: 'Flagged',
    messages: [
      { id: 'm-3', senderId: 'l-2', senderName: 'Sarah Jenkins', content: 'The rent is due on the 1st.', timestamp: '2024-02-26 09:30 AM', isFlagged: false },
      { id: 'm-4', senderId: 'l-2', senderName: 'Sarah Jenkins', content: 'Please send your bank details directly to my email.', timestamp: '2024-02-26 09:45 AM', isFlagged: true }
    ]
  }
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tk-1',
    userId: 'l-2',
    userType: 'Landlord',
    subject: 'Listing verification delay',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2024-02-24',
  },
  {
    id: 'tk-2',
    userId: 't-1',
    userType: 'Tenant',
    subject: 'Payment gateway error',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2024-02-25',
  },
];

export const PLATFORM_METRICS: PlatformMetrics[] = [
  // 2023 Data
  { month: 'Jan', year: 2023, gmv: 320000, commission: 25600, newUsers: 85 },
  { month: 'Feb', year: 2023, gmv: 340000, commission: 27200, newUsers: 90 },
  { month: 'Mar', year: 2023, gmv: 360000, commission: 28800, newUsers: 100 },
  { month: 'Apr', year: 2023, gmv: 380000, commission: 30400, newUsers: 110 },
  { month: 'May', year: 2023, gmv: 400000, commission: 32000, newUsers: 115 },
  { month: 'Jun', year: 2023, gmv: 420000, commission: 33600, newUsers: 125 },
  { month: 'Jul', year: 2023, gmv: 440000, commission: 35200, newUsers: 130 },
  { month: 'Aug', year: 2023, gmv: 430000, commission: 34400, newUsers: 120 },
  { month: 'Sep', year: 2023, gmv: 450000, commission: 36000, newUsers: 120 },
  { month: 'Oct', year: 2023, gmv: 480000, commission: 38400, newUsers: 145 },
  { month: 'Nov', year: 2023, gmv: 520000, commission: 41600, newUsers: 160 },
  { month: 'Dec', year: 2023, gmv: 610000, commission: 48800, newUsers: 210 },
  // 2024 Data
  { month: 'Jan', year: 2024, gmv: 580000, commission: 46400, newUsers: 185 },
  { month: 'Feb', year: 2024, gmv: 640000, commission: 51200, newUsers: 230 },
  { month: 'Mar', year: 2024, gmv: 680000, commission: 54400, newUsers: 250 },
  { month: 'Apr', year: 2024, gmv: 710000, commission: 56800, newUsers: 265 },
  { month: 'May', year: 2024, gmv: 740000, commission: 59200, newUsers: 280 },
  { month: 'Jun', year: 2024, gmv: 780000, commission: 62400, newUsers: 300 },
];
