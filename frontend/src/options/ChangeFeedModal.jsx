import { useState } from "react";
import './ChangeFeedModal.css';

export function ChangeFeedModal({isOpen, onClose, onTopicSubmit}) {
  const [topic, setTopic] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (!topic.trim()) return;
    onTopicSubmit(topic);
    onClose();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Your Feed</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Describe the type of content you want to see...</p>
          <input
            type="text"
            placeholder="e.g., posts about machine learning"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus // Automatically focus the input when modal opens
          />
        </div>
        <div className="modal-footer">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!topic.trim()} // input is empty
           >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}