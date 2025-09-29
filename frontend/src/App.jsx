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
  const [currentUser, setCurrentUser] = useState(null);

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  /**
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); **/

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://127.0.0.1:8000/users/myprofile/me', {
          headers: {'Authorization': `Bearer ${token}`}
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://127.0.0.1:8000/posts', {
          headers: {'Authorization': `Bearer ${token}`}
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data)
        }
      }
    }
    fetchPosts();
  }, [isAuthenticated]);

  const addPost = (newPost) => {
    const formattedPost = {
      Post: newPost,
      likes: 0,
      reposts: 0,
    };
    setPosts([formattedPost, ...posts]);
  };

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
        currentUser={currentUser}
      />
      <div className="main-content">      
        <Routes>
          <Route path="/" element={<HomePage posts={posts} />} />
          <Route path="/profile/:username" element={<ProfilePage currentUser={currentUser} />} />
        </Routes>
      </div>
      <CreatePost
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={addPost}
      />
      <UserLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setIsAuthenticated={setIsAuthenticated}
      />
    </>
  );
}

export default App
