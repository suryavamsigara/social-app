import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { ProfilePage } from './pages/ProfilePage';
import './App.css'

function App() {

  return (
    <>
      <Header />
      <SideBar />
      <div className="main-content">      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App
