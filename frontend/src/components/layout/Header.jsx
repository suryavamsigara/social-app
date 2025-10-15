import { NavLink } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <div className="header">
      <div className="left-section">
        <img src="../../logo.png" alt="logo"/>
      </div>

      <div className="middle-section">
        <div className="search-box">
          <i className="fa fa-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Search"/>
        </div>
      </div>

      <div className="right-section">
        right
      </div>
    </div>
  );
}