import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/',         icon: 'fa-home',           label: 'Dashboard' },
  { to: '/packages', icon: 'fa-map-marked-alt', label: 'Itineraries' },
  { to: '/contact',  icon: 'fa-headset',        label: 'Customer Support' },
];

const adminItems = [
  { to: '#', icon: 'fa-user-cog',       label: 'User Settings' },
  { to: '#', icon: 'fa-sliders-h',      label: 'Masters Settings' },
  { to: '#', icon: 'fa-users-cog',      label: 'HRM' },
  { to: '#', icon: 'fa-boxes',          label: 'Assets Management' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} id="sidebar" aria-label="Main navigation">
      <div className="sidebar-logo">
        <div className="sidebar-logo-left">
          <span className="sidebar-brand">HolidayBook</span>
        </div>
        <button
          className="sidebar-toggle-btn"
          id="sidebar-toggle-btn"
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(c => !c)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <nav className="nav-groups" aria-label="Sidebar navigation">
        <div className="nav-group-label">Menu</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <div className="nav-item-left">
              <span className="nav-icon"><i className={`fas ${item.icon}`}></i></span>
              <span className="nav-label">{item.label}</span>
            </div>
          </NavLink>
        ))}

        <div className="nav-group-label">User Control</div>
        {adminItems.map(item => (
          <a key={item.label} href={item.to} className="nav-item">
            <div className="nav-item-left">
              <span className="nav-icon"><i className={`fas ${item.icon}`}></i></span>
              <span className="nav-label">{item.label}</span>
            </div>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">GK</div>
        <div className="sidebar-user-info">
          <div className="name">Girish Kumar</div>
          <div className="role">Travel Manager</div>
        </div>
        <button className="sidebar-logout-btn" title="Logout" aria-label="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
}
