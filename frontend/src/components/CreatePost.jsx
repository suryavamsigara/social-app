import { useState } from 'react';
import './CreatePost.css';

export function CreatePost({ isOpen, onClose }) {
  const [postText, setPostText] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleUpload = () => {
    console.log("Uploading post:", postText);
    setPostText('');
    onClose(); 
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button 
            className="upload-button" 
            onClick={handleUpload}
            disabled={!postText.trim()}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
