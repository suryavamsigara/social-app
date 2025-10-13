import { NavLink } from 'react-router-dom';
import './RegisterOrLogin.css';

export function RegisterOrLogin({ isOpen, onClose, onLoginClick }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <p>Please login or register to continue</p>
        </div>
        <div className="modal-body">
          <button className="modal-button" onClick={onLoginClick}>Login</button>
          <NavLink to="/register" className="modal-button secondary" onClick={onClose}>
            Register
          </NavLink>
        </div>
      </div>
    </div>
  );
}