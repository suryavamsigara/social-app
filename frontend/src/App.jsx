import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { ProfilePage } from './pages/ProfilePage';
import { CreatePost } from './components/CreatePost';
import { UserLogin } from './components/UserLogin';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <>
      <Header />
      <SideBar
        onPostClick={() => setIsCreatePostModalOpen(true)}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <div className="main-content">      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <CreatePost isOpen={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)} />
      <UserLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setIsAuthenticated={setIsAuthenticated}
      />
    </>
  );
}

export default App
