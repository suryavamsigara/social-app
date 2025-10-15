import { useState } from 'react';
import './QuirkyAi.css';

export function QuirkyAi({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello! I am QuirkyAI. How can I help you?'}
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { from: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage, { from: 'ai', text: '...' }]);
    
    const messageToSend = inputText;
    setInputText('');

    try {
      const response = await fetch('http://127.0.0.1:8000/quirky/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: messageToSend}),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse = {from: 'ai', text: data.reply};

      setMessages(prev => [...prev.slice(0, -1), aiResponse]);

    } catch (error) {
      console.error("AI chat error:", error);
      const errorResponse = {from: 'ai', text: 'Sorry! I am having trouble connecting.'};
      setMessages(prev => [...prev.slice(0, -1), errorResponse]);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>QuirkyAI</h3>
        <button className="close-ai-button" onClick={onClose}>&times;</button>
      </div>
      <div className="ai-message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-from ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="ai-chat-input-area">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
