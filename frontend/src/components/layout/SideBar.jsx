import { NavLink } from 'react-router-dom';
import './SideBar.css';

export function SideBar({ isAuthenticated, onLogin, onLogout, onPostClick, currentUser, onChangeView }) {
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
            <button className="sidebar-item create-post-button" onClick={onPostClick}>
              <i className="fa fa-plus plus-icon"></i>
              <div>Create</div>
            </button>
            <div className="sidebar-item">
              <i className="fa fa-gear settings-icon"></i>
              <div>Settings</div>
            </div>
            <NavLink to={`/profile/${currentUser.username}`} className="sidebar-item">
              <i className="fa fa-user user-icon"></i>
              <div>Profile</div>
            </NavLink>
            <button className="sidebar-item bookmarks-button">
              <i className="fa fa-bookmark bookmark-icon"></i>
              <div>Bookmarks</div>
            </button>

            <button className="sidebar-item auth-button" onClick={onLogout}>
              <i className="fa fa-sign-out"></i>
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
              <i className="fa fa-sign-in"></i>
              <div>Login</div>
            </button>
          </>
        )}
        
      </div>

      <div className="right-sidebar">
        <div className="sidebar-item">
          <i className="fa fa-feed feed-icon"></i>
          <div>Change Feed</div>
        </div>
        <div className="sidebar-item" onClick={() => onChangeView('ai_chat')}>
          <img src="/quirky.png" className="ai-logo"></img>
          <div>QuirkyAI</div>
        </div>
      </div>

      {/* for phone */}
      <nav className="bottom-nav">
        <NavLink to="/" className="bottom-nav-item">
          <i className="fa fa-home"></i>
        </NavLink>
        <div className="bottom-nav-item" onClick={() => onChangeView('ai_chat')}>
          <img src="/quirky.png" className="quirky-logo" />
        </div>
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