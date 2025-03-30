import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_PORTS = [5000, 5001, 5002, 3001];

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [apiPort, setApiPort] = useState(API_PORTS[0]);

  // Test backend connection on component mount
  useEffect(() => {
    const testBackend = async () => {
      for (const port of API_PORTS) {
        try {
          await axios.get(`http://localhost:${port}/api/test`);
          console.log(`Backend connection successful on port ${port}`);
          setApiPort(port);
          return;
        } catch (error) {
          console.log(`Failed to connect on port ${port}, trying next...`);
        }
      }
      setErrorMessage('Cannot connect to server. Please try again later.');
    };
    testBackend();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`http://localhost:${apiPort}/api/chat`, {
        message: input
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setMessages(prev => [...prev, {
        text: response.data.reply,
        isUser: false
      }]);

    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      
      const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message ||
                     error.message ||
                     'Failed to get AI response';

      setErrorMessage(typeof errorMsg === 'string' ? errorMsg : 'An error occurred');
      
      setMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble connecting to the AI service. Please check if the OpenAI API key is properly configured.",
        isUser: false,
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
        <div className="p-4 bg-orange-500 text-white">
          <h1 className="text-2xl font-bold">Study Assistant AI</h1>
          <p className="text-sm opacity-90">Ask me anything about studying, time management, or focus techniques!</p>
        </div>

        {/* Error Message Banner */}
        {errorMessage && typeof errorMessage === 'string' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            {errorMessage}
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>👋 Hi! I'm your study assistant.</p>
              <p className="text-sm mt-2">Ask me about:</p>
              <ul className="text-sm mt-1">
                <li>• Study techniques</li>
                <li>• Time management</li>
                <li>• Focus strategies</li>
                <li>• Learning methods</li>
              </ul>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isUser 
                    ? 'bg-orange-500 text-white' 
                    : message.isError 
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about studying..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chatbot; 