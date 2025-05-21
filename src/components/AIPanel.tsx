import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  Zap, X, FileText, Copy, CheckCircle2, AlertTriangle, RotateCcw,
  Loader2, Search
} from 'lucide-react';
import { useState } from 'react';

const AIPanel = () => {
  const { setShowAIPanel, aiSuggestions, currentConversationId, conversations, searchAIResponses } = useAppContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof aiSuggestions>([]);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const lastMessage = currentConversation?.messages[currentConversation.messages.length - 1];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchAIResponses(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search responses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateMore = async () => {
    if (!lastMessage) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call your AI service
      setIsGenerating(false);
    } catch (err) {
      setError('Failed to generate responses. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleSummarize = async () => {
    if (!currentConversation) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call your AI service
      setIsGenerating(false);
    } catch (err) {
      setError('Failed to summarize conversation. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-border dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <Zap size={18} className="text-primary dark:text-blue-400 mr-2" />
          <h3 className="font-medium dark:text-white">AI Assistant</h3>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-secondary/10 dark:hover:bg-gray-700"
          onClick={() => setShowAIPanel(false)}
        >
          <X size={18} className="dark:text-gray-400" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search AI responses..."
              className="input w-full pl-9 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {isSearching ? (
                <Loader2 size={16} className="animate-spin dark:text-gray-400" />
              ) : (
                <Search size={16} className="text-text-light dark:text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-start space-x-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary dark:bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Zap size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm mb-1 dark:text-gray-300">I've analyzed the conversation and can help you respond. Here are some suggestions:</p>
            </div>
          </div>
        </div>
        
        {/* AI Suggestions */}
        <div className="space-y-3">
          {error && (
            <div className="p-3 bg-error/10 rounded-lg text-error text-sm dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}
          
          {(searchQuery ? searchResults : aiSuggestions).map((suggestion) => (
            <div 
              key={suggestion.id}
              className="card p-3 hover:border-primary/30 transition-colors dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <FileText size={14} className="text-primary dark:text-blue-400 mr-1.5" />
                  <span className="text-xs text-text-light dark:text-gray-400">Suggested response</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium bg-secondary/10 text-secondary px-1.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                  <button 
                    className="p-1 rounded hover:bg-secondary/10 dark:hover:bg-gray-600"
                    onClick={() => handleCopy(suggestion.id, suggestion.text)}
                  >
                    {copiedId === suggestion.id ? (
                      <CheckCircle2 size={14} className="text-success dark:text-green-400" />
                    ) : (
                      <Copy size={14} className="dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm dark:text-gray-300">{suggestion.text}</p>
            </div>
          ))}
          
          {/* Generate more */}
          <button 
            className="btn btn-secondary w-full flex items-center justify-center dark:bg-gray-700 dark:text-gray-300"
            onClick={handleGenerateMore}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RotateCcw size={14} className="mr-2" />
                Generate more responses
              </>
            )}
          </button>
        </div>
        
        {/* AI Disclaimer */}
        <div className="mt-6 p-3 bg-warning/10 rounded-lg dark:bg-yellow-900/30">
          <div className="flex items-start">
            <AlertTriangle size={16} className="text-warning dark:text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-text-light dark:text-gray-400">
                AI-generated responses may not always be accurate. Review suggestions before sending to ensure they're appropriate for the context.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-4 border-t border-border dark:border-gray-700">
        <div className="space-y-2">
          <button 
            className="btn btn-primary w-full dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={handleSummarize}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Summarize conversation'
            )}
          </button>
          <button 
            className="btn btn-secondary w-full dark:bg-gray-700 dark:text-gray-300"
            disabled={isGenerating}
          >
            Draft email response
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;