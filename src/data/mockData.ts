import { Conversation, User, Message } from '../types';

// Mock Users (Customers)
export const initialUsers: User[] = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    company: 'TechSolutions Inc.',
    status: 'online',
    location: 'San Francisco, CA',
    lastSeen: '2 minutes ago',
    browser: 'Chrome 98 (Mac)',
    device: 'MacBook Pro',
    tags: ['premium', 'enterprise']
  },
  {
    id: 'user2',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    company: 'Marketing Wizards',
    status: 'away',
    location: 'New York, NY',
    lastSeen: '35 minutes ago',
    browser: 'Firefox 97 (Windows)',
    device: 'Windows PC',
    tags: ['new user', 'free tier']
  },
  {
    id: 'user3',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    company: 'Design Masters LLC',
    status: 'online',
    location: 'Austin, TX',
    lastSeen: 'Just now',
    browser: 'Safari 15 (iOS)',
    device: 'iPhone 13',
    tags: ['premium', 'design']
  },
  {
    id: 'user4',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@example.com',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    company: 'Data Insights Co.',
    status: 'offline',
    location: 'Chicago, IL',
    lastSeen: '3 hours ago',
    browser: 'Edge 98 (Windows)',
    device: 'Surface Pro',
    tags: ['enterprise', 'data']
  },
  {
    id: 'user5',
    name: 'Olivia Parker',
    email: 'olivia.parker@example.com',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
    company: 'Parker & Associates',
    status: 'online',
    location: 'Seattle, WA',
    lastSeen: '5 minutes ago',
    browser: 'Chrome 98 (Android)',
    device: 'Samsung Galaxy S21',
    tags: ['premium', 'legal']
  }
];

// Mock Team Members (Support Agents/Admins)
export const initialTeamMembers: User[] = [
  {
    id: 'team1',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'Customer Support Lead',
    status: 'online'
  },
  {
    id: 'team2',
    name: 'Jordan Lee',
    email: 'jordan.lee@company.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'Support Agent',
    status: 'online'
  },
  {
    id: 'team3',
    name: 'Taylor Reed',
    email: 'taylor.reed@company.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'Support Agent',
    status: 'away'
  }
];

// Generate mock messages for each conversation
const generateMessages = (userId: string, count: number, startTime: string): Message[] => {
  const messages: Message[] = [];
  let currentTime = new Date(startTime);

  for (let i = 0; i < count; i++) {
    const isUserMessage = i % 2 === 0;
    currentTime = new Date(currentTime.getTime() + Math.floor(Math.random() * 30) * 60000);

    messages.push({
      id: `msg-${userId}-${i}`,
      text: isUserMessage 
        ? sampleUserMessages[Math.floor(Math.random() * sampleUserMessages.length)]
        : sampleAgentMessages[Math.floor(Math.random() * sampleAgentMessages.length)],
      sender: isUserMessage ? 'user' : 'admin',
      timestamp: currentTime.toISOString(),
      userId: isUserMessage ? userId : 'team1'
    });
  }

  return messages;
};

// Sample message content
const sampleUserMessages = [
  "Hi there, I'm having an issue with billing. Can you help me understand the charges on my latest invoice?",
  "The new dashboard looks great, but I can't seem to find the export feature anymore. Where did it go?",
  "I keep getting an error when trying to connect my Google Analytics account. It says 'Authentication failed'.",
  "We need to add 5 more seats to our account. What's the process for that?",
  "When will the new reporting features be available? I saw them mentioned in your latest blog post.",
  "The mobile app is crashing whenever I try to upload multiple images at once. Is this a known issue?",
  "I'm trying to cancel my subscription but can't find the option in my account settings.",
  "Do you offer any discounts for educational institutions? We're a university considering your platform.",
  "How do I change the primary contact email for our account?",
  "The data in my dashboard doesn't seem to be updating in real-time as it used to. Is there a delay now?"
];

const sampleAgentMessages = [
  "I'd be happy to help you with your billing question. Let me check your account details.",
  "Thanks for reaching out! The export feature has been moved to the 'Data' tab in the new interface. Let me show you where.",
  "I understand how frustrating authentication errors can be. Let's troubleshoot this together.",
  "Adding more seats is easy! I can process that change for you right now if you'd like.",
  "The new reporting features are scheduled for release next month. Would you like me to add you to our beta tester list?",
  "I'm sorry to hear about the app crashing. We'll need some more information to help diagnose the issue.",
  "I can help you cancel your subscription. Just to understand better, may I ask why you're considering cancelling?",
  "Yes, we do offer educational discounts! We can provide a 25% discount for universities.",
  "Changing your primary contact email is simple. I'll guide you through the process.",
  "You're right, there was a brief issue with our real-time updates. Our team just fixed it, so please refresh your dashboard."
];

// Mock Conversations
export const initialConversations: Conversation[] = [
  {
    id: 'conv1',
    userId: 'user1',
    assignedTo: 'team1',
    status: 'active',
    priority: 'high',
    subject: 'Billing Issue with Recent Charge',
    messages: generateMessages('user1', 8, '2023-05-01T09:30:00Z'),
    createdAt: '2023-05-01T09:30:00Z',
    lastMessageTime: '2023-05-01T11:45:00Z',
    tags: ['billing', 'urgent'],
    source: 'web',
    unreadCount: 2
  },
  {
    id: 'conv2',
    userId: 'user2',
    assignedTo: undefined,
    status: 'waiting',
    priority: 'medium',
    subject: 'Feature Request - Export Functionality',
    messages: generateMessages('user2', 5, '2023-05-02T14:15:00Z'),
    createdAt: '2023-05-02T14:15:00Z',
    lastMessageTime: '2023-05-02T15:30:00Z',
    tags: ['feature request'],
    source: 'email',
    unreadCount: 0
  },
  {
    id: 'conv3',
    userId: 'user3',
    assignedTo: 'team2',
    status: 'active',
    priority: 'low',
    subject: 'Integration with Third-party API',
    messages: generateMessages('user3', 12, '2023-05-03T10:00:00Z'),
    createdAt: '2023-05-03T10:00:00Z',
    lastMessageTime: '2023-05-03T16:45:00Z',
    tags: ['technical', 'integration'],
    source: 'web',
    unreadCount: 1
  },
  {
    id: 'conv4',
    userId: 'user4',
    assignedTo: 'team3',
    status: 'resolved',
    priority: 'medium',
    subject: 'Account Upgrade Inquiry',
    messages: generateMessages('user4', 6, '2023-05-04T08:20:00Z'),
    createdAt: '2023-05-04T08:20:00Z',
    lastMessageTime: '2023-05-04T10:15:00Z',
    tags: ['account', 'upgrade'],
    source: 'mobile',
    unreadCount: 0
  },
  {
    id: 'conv5',
    userId: 'user5',
    assignedTo: undefined,
    status: 'active',
    priority: 'high',
    subject: 'Mobile App Crashing Issue',
    messages: generateMessages('user5', 3, '2023-05-05T13:10:00Z'),
    createdAt: '2023-05-05T13:10:00Z',
    lastMessageTime: '2023-05-05T13:45:00Z',
    tags: ['bug', 'mobile'],
    source: 'mobile',
    unreadCount: 3
  }
];