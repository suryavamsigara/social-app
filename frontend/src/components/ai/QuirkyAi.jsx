import { useState } from 'react';
import './QuirkyAi.css';

export function QuirkyAi({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello! I am QuirkyAI. How can I help you?'}
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = { from: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);

    const aiResponse = { from: 'ai', text: 'That is interesting'};
    setMessages(prev => [...prev, aiResponse]);

    setInputText('');
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