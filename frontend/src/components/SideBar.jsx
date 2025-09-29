import { NavLink } from 'react-router-dom';
import './SideBar.css';

export function SideBar({ isAuthenticated, onLogin, onLogout, onPostClick, currentUser }) {
  return (
    <>
      <div className="left-sidebar">
        {isAuthenticated && currentUser ? (
          <>
            <NavLink to="/" className="sidebar-item">
              <i className="fa fa-home home-icon"></i>
              <div>Home</div>
            </NavLink>
            <div className="sidebar-item">
              <i className="fa fa-bell notification-icon"></i>
              <div>Notifications</div>
            </div>
            <div className="sidebar-item">
              <i className="fa fa-envelope message-icon"></i>
              <div>Messages</div>
            </div>
            <div className="sidebar-item">
              <i className="fa fa-gear settings-icon"></i>
              <div>Settings</div>
            </div>
            <NavLink to={`/profile/${currentUser.username}`} className="sidebar-item">
              <i className="fa fa-user user-icon"></i>
              <div>Profile</div>
            </NavLink>
            <button className="sidebar-item create-post-button" onClick={onPostClick}>
              <i className="fa fa-plus user-icon"></i>
              <div>Create</div>
            </button>

            <button className="sidebar-item auth-button" onClick={onLogout}>
              <i className="fa fa-sign-out-alt"></i>
              <div>Logout</div>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className="sidebar-item">
              <i className="fa fa-home"></i>
              <div>Home</div>
            </NavLink>
            <button className="sidebar-item auth-button" onClick={onLogin}>
              <i className="fa fa-sign-in-alt"></i>
              <div>Login</div>
            </button>
          </>
        )}
        
      </div>

      <div className="right-sidebar">
        <div className="sidebar-item">
          <i className="fa fa-feed feed-icon"></i>
          <div>Set Feed</div>
        </div>
      </div>

      {/* for phone */}
      <nav className="bottom-nav">
        <NavLink to="/" className="bottom-nav-item">
          <i className="fa fa-home"></i>
        </NavLink>
        <NavLink to="/search" className="bottom-nav-item">
          <i className="fa fa-search"></i>
        </NavLink>
        <NavLink className="create-post-button bottom-nav-item" onClick={onPostClick}>
          <i className="fa fa-plus"></i>
        </NavLink>
        <NavLink to="/notifications" className="bottom-nav-item">
          <i className="fa fa-bell"></i>
        </NavLink>
        {currentUser && (
          <NavLink to={`/profile/${currentUser.username}`} className="bottom-nav-item">
            <i className="fa fa-user"></i>
          </NavLink>
        )} 
      </nav>
    </>
  );
}