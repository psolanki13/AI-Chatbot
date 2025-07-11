// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    // Get the Clerk session token
    const token = await window.Clerk?.session?.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

// API service for chat functionality
export const chatAPI = {
  // Send message to chatbot
  sendMessage: async (message, sessionId = null) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },

  // Get all conversations
  getConversations: async () => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      return await response.json();
    } catch (error) {
      console.error('Get Conversations Error:', error);
      throw error;
    }
  },

  // Get specific conversation
  getConversation: async (sessionId) => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/conversations/${sessionId}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Get Conversation Error:', error);
      throw error;
    }
  },

  // Delete conversation
  deleteConversation: async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete Conversation Error:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default chatAPI;
