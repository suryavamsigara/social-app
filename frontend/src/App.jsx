import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { ProfilePage } from './pages/ProfilePage';
import { CreatePost } from './components/CreatePost';
import './App.css'

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <Header />
      <SideBar onPostClick={openModal} />
      <div className="main-content">      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <CreatePost isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default App
