import { useState } from 'react';
import './CreatePost.css';

export function CreatePost({ isOpen, onClose, onPostCreated }) {
  const [postText, setPostText] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleUpload = async () => {
    const postData = {
      content: postText,
      name: name,
    };

    try {
      const token = localStorage.getItem('token');

      if (!token) {
          console.error("Authentication token not found. Please log in.");
          return; 
      }

      const response = await fetch('http://127.0.0.1:8000/posts/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newPost = await response.json();
      console.log("Successfully created post: ", newPost)

      onPostCreated(newPost);

      setPostText('');
      onClose();
    } catch (error) {
      console.log("Failed to create post: ", error);
    } 
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
