import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  ChevronLeft, MoreHorizontal, CheckCircle2, PanelRight, 
  SendHorizontal, Paperclip, Smile, User, Flag, Users, ArrowLeft
} from 'lucide-react';
import { formatTime, formatDate } from '../utils/dateUtils';

interface ConversationDetailProps {
  conversationId: string;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversationId }) => {
  const { 
    conversations, 
    users, 
    teamMembers,
    addMessage, 
    markAsResolved, 
    assignToUser,
    setCurrentConversationId,
    setShowAIPanel,
    currentUser
  } = useAppContext();
  
  const conversation = conversations.find(c => c.id === conversationId);
  const user = conversation ? users.find(u => u.id === conversation.userId) : null;
  const assignedTeamMember = conversation?.assignedTo 
    ? teamMembers.find(t => t.id === conversation.assignedTo) 
    : null;
  
  const [message, setMessage] = useState('');
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Group messages by date
  const groupedMessages = conversation?.messages.reduce((groups, message) => {
    const date = formatDate(new Date(message.timestamp));
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof conversation.messages>) || {};

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !conversation) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'admin',
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'admin'
    };
    
    addMessage(conversationId, newMessage);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation || !user) {
    return <div className="p-8">Conversation not found</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="sm:hidden mr-2 p-1 rounded hover:bg-secondary/10"
            onClick={() => setCurrentConversationId(null)}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <div className="avatar w-8 h-8 mr-2">
              <img src={user.avatar} alt={user.name} />
            </div>
            <div>
              <div className="font-medium flex items-center">
                {user.name}
                <div className={`
                  ml-2 h-2 w-2 rounded-full 
                  ${user.status === 'online' ? 'bg-success' : 
                    user.status === 'away' ? 'bg-warning' : 'bg-text-light'}
                `}></div>
              </div>
              <div className="text-xs text-text-light">{user.company}</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            className="btn btn-ghost p-2"
            onClick={() => markAsResolved(conversationId)}
          >
            <CheckCircle2 size={18} />
          </button>
          <button 
            className="btn btn-ghost p-2 hidden sm:inline-flex"
            onClick={() => setIsUserInfoOpen(!isUserInfoOpen)}
          >
            <User size={18} />
          </button>
          <button 
            className="btn btn-ghost p-2 lg:hidden"
            onClick={() => setShowAIPanel(true)}
          >
            <PanelRight size={18} />
          </button>
          <button className="btn btn-ghost p-2">
            <Flag size={18} />
          </button>
          <button className="btn btn-ghost p-2">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          {/* Subject */}
          {conversation.subject && (
            <div className="mb-6 text-center">
              <h3 className="inline-block px-4 py-2 bg-surface rounded-lg text-text">
                {conversation.subject}
              </h3>
            </div>
          )}
          
          {/* Messages grouped by date */}
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs text-text-light">{date}</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              
              {messages.map((message, index) => {
                const isUserMessage = message.sender === 'user';
                const sender = isUserMessage ? user : teamMembers.find(t => t.id === message.userId);
                const isFirstInGroup = index === 0 || messages[index - 1].sender !== message.sender;
                const showAvatar = isFirstInGroup;
                
                return (
                  <div 
                    key={message.id} 
                    className={`
                      flex ${isUserMessage ? 'justify-start' : 'justify-end'}
                      ${!isFirstInGroup ? 'mt-1' : 'mt-6'}
                    `}
                  >
                    {isUserMessage && showAvatar && (
                      <div className="avatar w-8 h-8 mr-2 mt-1 flex-shrink-0">
                        <img src={sender?.avatar} alt={sender?.name} />
                      </div>
                    )}
                    
                    <div className={`
                      max-w-[85%] px-4 py-2 rounded-lg
                      ${isUserMessage 
                        ? 'bg-surface text-text' 
                        : 'bg-primary text-white'}
                      ${isUserMessage 
                        ? (!showAvatar ? 'ml-10' : '') 
                        : ''}
                      animate-fade-in
                    `}>
                      {isFirstInGroup && (
                        <div className={`text-xs mb-1 ${isUserMessage ? 'text-text-light' : 'text-white/70'}`}>
                          {isUserMessage ? sender?.name : 'You'} • {formatTime(new Date(message.timestamp))}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    </div>
                    
                    {!isUserMessage && showAvatar && (
                      <div className="avatar w-8 h-8 ml-2 mt-1 flex-shrink-0">
                        <img src={currentUser?.avatar} alt={currentUser?.name} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* User info sidebar */}
        {isUserInfoOpen && (
          <div className="hidden sm:block w-80 border-l border-border overflow-y-auto">
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="avatar w-16 h-16 mx-auto mb-2">
                  <img src={user.avatar} alt={user.name} className="rounded-full" />
                </div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-text-light text-sm">{user.company}</p>
                <div className="flex items-center justify-center mt-2">
                  <span className={`
                    h-2 w-2 rounded-full mr-1.5
                    ${user.status === 'online' ? 'bg-success' : 
                      user.status === 'away' ? 'bg-warning' : 'bg-text-light'}
                  `}></span>
                  <span className="text-sm capitalize">{user.status}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Customer details */}
                <div>
                  <h4 className="text-xs uppercase text-text-light font-medium mb-2">Customer Details</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Email</div>
                      <div className="w-2/3 text-sm">{user.email}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Location</div>
                      <div className="w-2/3 text-sm">{user.location || 'Not available'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Tags</div>
                      <div className="w-2/3 flex flex-wrap gap-1">
                        {user.tags?.map(tag => (
                          <span key={tag} className="badge bg-secondary/10 text-secondary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Conversation details */}
                <div>
                  <h4 className="text-xs uppercase text-text-light font-medium mb-2">Conversation Details</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Status</div>
                      <div className="w-2/3">
                        <span className={`
                          badge ${conversation.status === 'active' ? 'badge-green' : 
                            conversation.status === 'waiting' ? 'badge-yellow' : 'badge-text-light'}
                        `}>
                          {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Priority</div>
                      <div className="w-2/3">
                        <span className={`
                          badge ${conversation.priority === 'high' ? 'badge-red' : 
                            conversation.priority === 'medium' ? 'badge-yellow' : 'bg-secondary/10 text-secondary'}
                        `}>
                          {conversation.priority.charAt(0).toUpperCase() + conversation.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Created</div>
                      <div className="w-2/3 text-sm">
                        {formatDate(new Date(conversation.createdAt))}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Source</div>
                      <div className="w-2/3 text-sm capitalize">{conversation.source || 'Web'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Assignment section */}
                <div>
                  <h4 className="text-xs uppercase text-text-light font-medium mb-2">Assignment</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-text-light">Assigned to</label>
                      <div className="mt-1">
                        <select 
                          className="input w-full"
                          value={conversation.assignedTo || ''}
                          onChange={e => assignToUser(conversationId, e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {teamMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {assignedTeamMember && (
                      <div className="flex items-center mt-2">
                        <div className="avatar w-6 h-6 mr-2">
                          <img src={assignedTeamMember.avatar} alt={assignedTeamMember.name} />
                        </div>
                        <div className="text-sm">{assignedTeamMember.name}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Browser/Device info */}
                <div>
                  <h4 className="text-xs uppercase text-text-light font-medium mb-2">Technical Info</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Browser</div>
                      <div className="w-2/3 text-sm">{user.browser || 'Not available'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 text-sm text-text-light">Device</div>
                      <div className="w-2/3 text-sm">{user.device || 'Not available'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea 
              placeholder="Type your message..."
              className="input min-h-[80px] w-full resize-none pt-3 pb-8 text-base"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute bottom-2 left-3 flex items-center space-x-1.5">
              <button className="p-1 text-text-light hover:text-text transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-1 text-text-light hover:text-text transition-colors">
                <Smile size={18} />
              </button>
              <button className="p-1 text-text-light hover:text-text transition-colors">
                <Users size={18} />
              </button>
            </div>
          </div>
          <button 
            className="btn btn-primary h-10 w-10 rounded-full flex items-center justify-center p-0"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;