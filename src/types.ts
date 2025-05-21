export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  company?: string;
  status?: 'online' | 'away' | 'offline';
  location?: string;
  lastSeen?: string;
  browser?: string;
  device?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'bot';
  timestamp: string;
  userId: string;
  attachments?: Attachment[];
  isTyping?: boolean;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'link';
  url: string;
  name: string;
  size?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  assignedTo?: string;
  status: 'active' | 'waiting' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  subject?: string;
  messages: Message[];
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  tags?: string[];
  source?: 'web' | 'mobile' | 'email';
  unreadCount: number;
}

export interface AIResponse {
  id: string;
  text: string;
  confidence: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'online' | 'away' | 'offline';
}

export interface NotificationType {
  id: string;
  type: 'message' | 'assignment' | 'mention' | 'system';
  content: string;
  isRead: boolean;
  timestamp: string;
  conversationId?: string;
}