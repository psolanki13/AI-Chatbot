import React, { useState, useRef, useEffect } from 'react';
import { Bot, RefreshCw, Settings, MoreVertical, Trash2, History } from 'lucide-react';
import Message from './Message';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { chatAPI } from '../services/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await chatAPI.healthCheck();
        setIsConnected(health.database?.connected || false);
        console.log('Backend status:', health);
      } catch (error) {
        setIsConnected(false);
        console.error('Backend connection failed:', error);
      }
    };

    const loadConversations = async () => {
      try {
        const response = await chatAPI.getConversations();
        setConversations(response.conversations || []);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    checkConnection();
    loadConversations();
  }, []);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send message to backend with session ID
      const response = await chatAPI.sendMessage(messageText, sessionId);

      // Update session ID if this is a new conversation
      if (!sessionId && response.sessionId) {
        setSessionId(response.sessionId);
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        content: response.response,
        isUser: false,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        content: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
        isUser: false,
        timestamp: new Date().toISOString(),
      }
    ]);
    setSessionId(null); // Reset session
    setError(null);
  };

  const handleLoadConversation = async (convSessionId) => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getConversation(convSessionId);
      
      if (response.success && response.conversation) {
        const conv = response.conversation;
        const formattedMessages = conv.messages.map((msg, index) => ({
          id: index + 1,
          content: msg.content,
          isUser: msg.role === 'user',
          timestamp: msg.timestamp,
        }));

        setMessages(formattedMessages);
        setSessionId(conv.sessionId);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (convSessionId) => {
    try {
      await chatAPI.deleteConversation(convSessionId);
      
      // Refresh conversations list
      const response = await chatAPI.getConversations();
      setConversations(response.conversations || []);
      
      // If we deleted the current conversation, start fresh
      if (convSessionId === sessionId) {
        handleClearChat();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsConnected(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Conversation history"
          >
            <History size={18} />
          </button>
          <button
            onClick={handleRetry}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh connection"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="absolute top-0 left-0 w-80 h-full bg-white border-r border-gray-200 shadow-lg z-10">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.sessionId}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    conv.sessionId === sessionId ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleLoadConversation(conv.sessionId)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {conv.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {conv.messageCount} messages
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.sessionId);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Connection Error Banner */}
      {!isConnected && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-700">
                Cannot connect to backend server. Please check if the server is running.
              </span>
            </div>
            <button
              onClick={handleRetry}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!isConnected}
      />
    </div>
  );
};

export default ChatBot;
