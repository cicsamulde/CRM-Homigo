/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VerificationDocument {
  id: string;
  type: 'ID' | 'Proof of Ownership' | 'Business License' | 'Selfie';
  url: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedAt: string;
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalProperties: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  joinedDate: string;
  kycStatus: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  documents?: VerificationDocument[];
}

export interface Property {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  type: 'Apartment' | 'House' | 'Studio' | 'Condo';
  status: 'Published' | 'Draft' | 'Under Review';
  verificationStatus: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  rent: number;
  commissionRate: number;
  image: string;
  documents?: VerificationDocument[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  status: 'Active' | 'Pending' | 'Past';
  kycStatus: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  documents?: VerificationDocument[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFlagged: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'Landlord' | 'Tenant' | 'Admin';
  }[];
  lastMessage: string;
  updatedAt: string;
  status: 'Active' | 'Flagged' | 'Archived';
  messages: Message[];
}

export interface Subscription {
  id: string;
  landlordId: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Past Due' | 'Canceled';
  billingCycle: 'Monthly' | 'Yearly';
  amount: number;
  nextBillingDate: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  score: number; // 0-100
  source: 'Website' | 'Referral' | 'Social Media' | 'Direct';
  type: 'Tenant' | 'Landlord';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  interestedIn?: string;
  tags: string[];
  segment?: string;
  createdAt: string;
}

export interface LeadSegment {
  id: string;
  name: string;
  description: string;
  color: string;
  count: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userType: 'Landlord' | 'Tenant';
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export type Role = 'Super Admin' | 'Admin' | 'Editor' | 'Viewer';

export interface InternalUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface PlatformMetrics {
  month: string;
  year: number;
  gmv: number;
  commission: number;
  newUsers: number;
}
