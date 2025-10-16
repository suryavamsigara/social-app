import { useState, useEffect, useRef } from 'react';
import './QuirkyAi.css';

export function QuirkyAi({ onClose }) {
  const [messages, setMessages] = useState([
    {role: 'ai', text: 'Hello! I am QuirkyAI. How can I help you?'}
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage, { role: 'ai', text: '', loading: true}]);
    
    const messageToSend = inputText;
    setInputText('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Not authenticated. Please login.");
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/quirky/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({message: messageToSend}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = {role: 'ai', text: data.reply};

      setMessages(prev => [...prev.slice(0, -1), aiResponse]);

    } catch (error) {
      console.error("AI chat error:", error);
      const errorResponse = {role: 'ai', text: 'Sorry! I am having trouble connecting.'};
      setMessages(prev => [...prev.slice(0, -1), errorResponse]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>QuirkyAI</h3>
        <button className="close-ai-button" onClick={onClose}>&times;</button>
      </div>
      <div className="ai-message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-from ${msg.role}`}>
            {msg.loading ? <div className="pulse"></div> : msg.text}
          </div>
        ))}
        <div ref={chatEndRef}/>
      </div>
      <div className="ai-chat-input-area">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
