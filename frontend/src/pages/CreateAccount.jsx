import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateAccount.css';

export function CreateAccount() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleRegistration = async (event) => {
    event.preventDefault(); // Prevents the page from reloading
    setErrorMessage('');

    const registrationData = {
      username,
      email,
      password,
      name,
      bio
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setErrorMessage(responseData.detail || "Registration failed. Please check your details");
        throw new Error(`HTTP Error! Status: ${response.status}`)
      }
      
      console.log("Account created successfully");

      navigate('/');

    } catch (error) {
      console.error("Failed to register: ", error);
    }
  };

  return (
    <div className="registration-page-container">
      <form onSubmit={handleRegistration} className="registration-form">
        <h2>Create a new account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Fullname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}