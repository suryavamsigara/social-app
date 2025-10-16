import { useState, useRef } from "react";
import './UserLogin.css';

export function UserLogin({ isOpen, onClose, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const passWordInputRef = useRef(null);
  
  if (!isOpen) {
    return null;
  }

  const handleUsernameKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      passWordInputRef.current.focus();
    }
  };

  const handleAPILogin = async () => {
    const loginData = {
      username: email,
      password: password  
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(loginData),
      });

      if (!response.ok) {
        setError("Authentication failed. Enter valid email and password.");
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      localStorage.setItem('token', responseData.access_token);

      console.log("User logged in", responseData);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      onClose();
      setError('');
    } catch (error) {
      console.error("Failed to login: ", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="show-error">{error}</div>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <input 
            className="username-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleUsernameKeyDown(e)}
          />
          <input 
            className="password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAPILogin()}
            ref={passWordInputRef}
          />
        </div>
        <div className="modal-footer">
          <button 
            className="login-button" 
            onClick={handleAPILogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}