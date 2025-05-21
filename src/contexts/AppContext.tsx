import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Conversation, User, Message, AIResponse } from '../types';
import { initialConversations, initialUsers, initialTeamMembers } from '../data/mockData';

interface AppContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  users: User[];
  teamMembers: User[];
  currentUser: User | null;
  showAIPanel: boolean;
  aiSuggestions: AIResponse[];
  selectedFilter: string;
  isDarkMode: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setCurrentConversationId: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setShowAIPanel: (value: boolean) => void;
  setSelectedFilter: (filter: string) => void;
  markAsResolved: (conversationId: string) => void;
  assignToUser: (conversationId: string, userId: string) => void;
  filterConversations: () => Conversation[];
  toggleDarkMode: () => void;
  searchAIResponses: (query: string) => Promise<AIResponse[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teamMembers] = useState<User[]>(initialTeamMembers);
  const [showAIPanel, setShowAIPanel] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Current authenticated user (admin/support agent)
  const currentUser = teamMembers.length > 0 ? teamMembers[0] : null;

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // AI suggestions based on current conversation
  const aiSuggestions: AIResponse[] = [
    {
      id: '1',
      text: "I understand your concern with the billing issue. Let me check your account details and get this resolved for you right away.",
      confidence: 0.92
    },
    {
      id: '2',
      text: "I can see you're on our Pro plan. The charge you're seeing is for the annual renewal. Would you like me to break down the details for you?",
      confidence: 0.85
    },
    {
      id: '3',
      text: "Let me offer you a 10% discount on your next renewal as an apology for the confusion.",
      confidence: 0.78
    }
  ];

  const searchAIResponses = async (query: string): Promise<AIResponse[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call your AI service
    return aiSuggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, message],
              lastMessage: message.text,
              lastMessageTime: new Date().toISOString(),
              unreadCount: conv.id === currentConversationId ? 0 : conv.unreadCount + 1
            } 
          : conv
      )
    );
  };

  const markAsResolved = (conversationId: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, status: 'resolved' } 
          : conv
      )
    );
  };

  const assignToUser = (conversationId: string, userId: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, assignedTo: userId } 
          : conv
      )
    );
  };

  const filterConversations = () => {
    switch (selectedFilter) {
      case 'unassigned':
        return conversations.filter(conv => !conv.assignedTo && conv.status !== 'resolved');
      case 'assigned':
        return conversations.filter(conv => !!conv.assignedTo && conv.status !== 'resolved');
      case 'mine':
        return conversations.filter(conv => conv.assignedTo === currentUser?.id && conv.status !== 'resolved');
      case 'resolved':
        return conversations.filter(conv => conv.status === 'resolved');
      case 'unread':
        return conversations.filter(conv => conv.unreadCount > 0 && conv.status !== 'resolved');
      case 'all':
      default:
        return conversations.filter(conv => conv.status !== 'resolved');
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    conversations,
    currentConversationId,
    users,
    teamMembers,
    currentUser,
    showAIPanel,
    aiSuggestions,
    selectedFilter,
    isDarkMode,
    setIsAuthenticated,
    setIsLoading,
    setCurrentConversationId,
    addMessage,
    setShowAIPanel,
    setSelectedFilter,
    markAsResolved,
    assignToUser,
    filterConversations,
    toggleDarkMode,
    searchAIResponses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};