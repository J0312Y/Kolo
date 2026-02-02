// User Types
export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  referralCode?: string;
  plan: UserPlan;
  walletBalance?: number;
  cardBalance?: number;
}

// Plan & Subscription Types
export type PlanTier = 'bronze' | 'silver' | 'gold';

export interface PlanFeatures {
  maxCircles: number; // -1 = unlimited
  adminFeePercent: number;
  customGoalsLimit: number; // 0 = none, -1 = unlimited
  prioritySupport: boolean;
  zeroFees: boolean;
  cashbackPercent: number;
  prioritySlots: boolean;
  advancedStats: boolean;
  referralMultiplier: number;
  paymentReminders: boolean;
  createCircles: boolean;
}

export interface AddOn {
  feature: string;
  expiryDate: string;
}

export interface UserPlan {
  tier: PlanTier;
  tierName: string;
  badge: string;
  color: string;
  subscriptionStart: string;
  subscriptionEnd: string | null;
  autoRenew: boolean;
  features: PlanFeatures;
  addOns: AddOn[];
}

// Likelemba (Circle) Types
export type CircleStatus = 'active' | 'finished' | 'pending';
export type CircleType = 'joined' | 'created';

export interface LikeLemba {
  id: string | number;
  name: string;
  description?: string;
  amount: string;
  duration: number; // in months
  totalMembers: number;
  currentMembers: number;
  type: CircleType;
  inviteCode: string;
  monthsCompleted: number;
  joinedDate: string;
  completedDate?: string;
  status: CircleStatus;
}

export interface LikeLembaMember {
  id: string | number;
  userId: string | number;
  name: string;
  slotNumber?: number;
  hasPaid: boolean;
  joinedDate: string;
}

// Goal Types
export type GoalCategory = 'education' | 'travel' | 'emergency' | 'business' | 'custom';

export interface Goal {
  id: string | number;
  name: string;
  icon: string;
  color: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: GoalCategory;
  description: string;
  active: boolean;
}

// Payment & Transaction Types
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type TransactionType = 'payment' | 'payout' | 'deposit' | 'withdrawal' | 'fee' | 'refund';
export type PaymentMethod = 'mobile' | 'card' | 'bank';

export interface PaymentDetails {
  mobileNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface Transaction {
  id: string | number;
  type: TransactionType;
  status: PaymentStatus;
  title: string;
  description: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  category: string;
}

// Notification Types
export type NotificationType = 'payment' | 'group' | 'payout' | 'system';

export interface Notification {
  id: string | number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

// Chat Types
export type ChatMessageType = 'message' | 'system' | 'notification';

export interface ChatMessage {
  id: string | number;
  sender: string;
  message: string;
  timestamp: string;
  isMe: boolean;
  type: ChatMessageType;
}

export interface GroupChat {
  [circleName: string]: ChatMessage[];
}

// Support Types
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string | number;
  sender: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}

export interface SupportTicket {
  id: string | number;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  messages: TicketMessage[];
}

// Address Types
export type AddressType = 'home_address' | 'work_address';

export interface Address {
  id: string | number;
  type: AddressType;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Security Types
export interface SecurityLog {
  id: string | number;
  action: string;
  device: string;
  location: string;
  timestamp: string;
  ipAddress?: string;
}

// Authentication Types
export type AuthScreen =
  | 'splash'
  | 'language'
  | 'phone'
  | 'otp'
  | 'userInfo'
  | 'onboarding1'
  | 'onboarding2'
  | 'onboarding3'
  | 'welcome';

export interface AuthData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode?: string;
  otpCode: string[];
}

// Screen Navigation Types
export type Screen =
  | 'home'
  | 'circles'
  | 'join'
  | 'payment'
  | 'payment-calendar'
  | 'card'
  | 'goal-detail'
  | 'my-goals'
  | 'create-goal'
  | 'saving-programs'
  | 'upgrade'
  | 'my-plan'
  | 'feature-store'
  | 'profile'
  | 'personal-info'
  | 'my-documents'
  | 'scan-national-id'
  | 'proof-income'
  | 'scan-utility-bill'
  | 'signing-requests'
  | 'manage-addresses'
  | 'language'
  | 'notifications'
  | 'transaction-history'
  | 'transaction-details'
  | 'financial-dashboard'
  | 'group-chat'
  | 'customer-support'
  | 'support-ticket'
  | 'security-settings'
  | 'change-passcode'
  | 'security-logs'
  | 'live-chat'
  | 'faq'
  | 'new-ticket'
  | 'whats-hot'
  | 'payout-eligibility'
  | 'payout-method';

export type Tab = 'home' | 'circles' | 'wallet' | 'card' | 'profile';
export type CirclesTab = 'active' | 'finished';
export type TransactionFilter = 'all' | 'payment' | 'payout' | 'deposit' | 'withdrawal';
export type NotificationFilter = 'all' | 'payment' | 'group' | 'payout' | 'system';
