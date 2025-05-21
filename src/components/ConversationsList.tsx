import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  Search, Filter, Clock, ArrowUpDown, ChevronDown, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

const ConversationsList: React.FC = () => {
  const { 
    filterConversations, 
    currentConversationId, 
    setCurrentConversationId,
    users
  } = useAppContext();
  
  const conversations = filterConversations();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredConversations = conversations.filter(conv => {
    const user = users.find(u => u.id === conv.userId);
    return (
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="input py-1.5 pl-9 pr-4 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light">
            <Search size={16} />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2">
          <button className="btn btn-secondary py-1 px-3 text-xs flex items-center">
            <Filter size={14} className="mr-1" />
            Filter
            <ChevronDown size={14} className="ml-1" />
          </button>
          <button className="btn btn-secondary py-1 px-3 text-xs flex items-center">
            <Clock size={14} className="mr-1" />
            Recent
          </button>
          <button className="btn btn-secondary py-1 px-3 text-xs flex items-center">
            <ArrowUpDown size={14} className="mr-1" />
            Sort
          </button>
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <ul className="divide-y divide-border">
            {filteredConversations.map(conversation => {
              const user = users.find(u => u.id === conversation.userId);
              
              return (
                <li 
                  key={conversation.id}
                  className={`
                    relative hover:bg-surface cursor-pointer transition-colors
                    ${currentConversationId === conversation.id ? 'bg-primary-light border-l-4 border-l-primary' : ''}
                  `}
                  onClick={() => setCurrentConversationId(conversation.id)}
                >
                  <div className="p-4">
                    {/* Header row */}
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <div className="avatar w-8 h-8 mr-3 relative">
                          <img 
                            src={user?.avatar} 
                            alt={user?.name} 
                            className="rounded-full"
                          />
                          <div className={`
                            absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white
                            ${user?.status === 'online' ? 'bg-success' : 
                              user?.status === 'away' ? 'bg-warning' : 'bg-text-light'}
                          `}></div>
                        </div>
                        <div>
                          <div className="font-medium">{user?.name}</div>
                          <div className="text-xs text-text-light">{user?.company}</div>
                        </div>
                      </div>
                      <div className="text-xs text-text-light">
                        {conversation.lastMessageTime && formatDistanceToNow(new Date(conversation.lastMessageTime))}
                      </div>
                    </div>
                    
                    {/* Subject/Preview */}
                    <div className="ml-11">
                      <div className="font-medium truncate">
                        {conversation.subject || 'New conversation'}
                      </div>
                      <div className="text-sm text-text-light truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                    
                    {/* Tags/Status */}
                    <div className="mt-2 ml-11 flex items-center flex-wrap">
                      {conversation.priority === 'high' && (
                        <span className="badge badge-red mr-2 mb-1 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          High priority
                        </span>
                      )}
                      
                      {conversation.status === 'resolved' && (
                        <span className="badge badge-green mr-2 mb-1 flex items-center">
                          <CheckCircle2 size={12} className="mr-1" />
                          Resolved
                        </span>
                      )}
                      
                      {conversation.tags?.map(tag => (
                        <span key={tag} className="badge bg-secondary/10 text-secondary mr-2 mb-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Unread indicator */}
                  {conversation.unreadCount > 0 && (
                    <div className="absolute top-4 right-4 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-light">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;