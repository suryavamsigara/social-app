import { Link } from 'react-router-dom';
import './SideBar.css';

export function SideBar() {
  return (
    <>
      <div className="left-sidebar">
        <Link to="/" className="sidebar-item">
          <i className="fa fa-home home-icon"></i>
          <div>Home</div>
        </Link>
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
        <Link to="/profile" className="sidebar-item">
          <i className="fa fa-user user-icon"></i>
          <div>Profile</div>
        </Link>
        <div className="sidebar-item">
          <i className="fa fa-plus user-icon"></i>
          <div>Create</div>
        </div>
      </div>

      <div className="right-sidebar">
        <div className="sidebar-item">
          <i className="fa fa-feed feed-icon"></i>
          <div>Set Feed</div>
        </div>
      </div>
    </>
  );
}