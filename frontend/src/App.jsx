import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Header } from './components/layout/Header';
import { SideBar } from './components/layout/SideBar';
import { ProfilePage } from './pages/ProfilePage';
import { CreatePost } from './components/posts/CreatePost';
import { UserLogin } from './components/UserLogin';
import { CreateAccount } from './pages/CreateAccount';
import { RegisterOrLogin } from './components/RegisterOrLogin';
import { QuirkyAi } from './components/ai/QuirkyAi';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterOrLoginModalOpen, setIsRegisterOrLoginModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const [mainView, setMainView] = useState('feed');

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
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setIsRegisterOrLoginModalOpen(true);
        }
      } else {
        setIsRegisterOrLoginModalOpen(true);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/posts', {headers});
        if (response.ok) {
          const data = await response.json();
          setPosts(data)
        }
      } catch (error) {
        console.error("Failed to fetch posts: ", error);
      }
    };
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsRegisterOrLoginModalOpen(true);
  };

  const openLoginModal = () => {
    setIsRegisterOrLoginModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const deletePostFromState = (postId) => {
    setPosts(currentPosts => currentPosts.filter(p => p.Post.id !== postId));
  }

  return (
    <>
      <Header />
      <SideBar
        onPostClick={() => setIsCreatePostModalOpen(true)}
        isAuthenticated={isAuthenticated}
        onLogin={() => {setIsRegisterOrLoginModalOpen(true)}}
        onLogout={handleLogout}
        currentUser={currentUser}
        onChangeView={setMainView}
      />
      <div className="main-content">      
        <Routes>
          <Route path="/" element={<HomePage
              posts={posts}
              onDeletePost={deletePostFromState}
              currentUser={currentUser}
              view={mainView}
              onChangeView={setMainView}
            />}
          
          />
          <Route path="/profile/:username" element={<ProfilePage
              currentUser={currentUser}
              onDeletePost={deletePostFromState}
            />}
          />
          <Route path="/register" element={<CreateAccount />} />
        </Routes>
      </div>
      <RegisterOrLogin
        isOpen={isRegisterOrLoginModalOpen}
        onClose={() => setIsRegisterOrLoginModalOpen(false)}
        onLoginClick={openLoginModal}
      />
      <UserLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setIsAuthenticated={setIsAuthenticated}
        setCurrentUser={setCurrentUser}
      />
      <CreatePost
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={addPost}
      />
    </>
  );
}

export default App
