import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../authContext';

// Sub-menu items under "Leads"
const leadsSubItems = [
  { to: '/leads', label: 'All Leads',    count: null },
  { to: '#',      label: 'New Leads',    count: null  },
  { to: '#',      label: 'Closed Leads', count: null  },
];

const adminItems = [
  { to: '#', icon: 'fa-user-cog',   label: 'User Settings'    },
  { to: '#', icon: 'fa-sliders-h',  label: 'Masters Settings' },
  { to: '#', icon: 'fa-users-cog',  label: 'HRM'              },
  { to: '#', icon: 'fa-boxes',      label: 'Assets Management'},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed,     setCollapsed]     = useState(false);
  const [leadsOpen,     setLeadsOpen]     = useState(false);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      id="sidebar"
      aria-label="Main navigation"
    >
      {/* ── Logo / Brand ─────────────────────────── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-left">
          <img
            src="/logo.png"
            alt="Voyager's Compass"
            style={{ height: '32px', width: 'auto' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <span className="sidebar-brand" style={{ marginLeft: '8px' }}>Voyager's Compass</span>
        </div>
        <button
          className="sidebar-toggle-btn"
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(c => !c)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <nav className="nav-groups" aria-label="Sidebar navigation">
        <div className="nav-group-label">Menu</div>

        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <div className="nav-item-left">
            <span className="nav-icon"><i className="fas fa-home"></i></span>
            <span className="nav-label">Dashboard</span>
          </div>
        </NavLink>

        {/* Leads — collapsible dropdown */}
        <div
          className={`nav-item${leadsOpen ? ' open' : ''}`}
          onClick={() => setLeadsOpen(o => !o)}
          style={{ cursor: 'pointer' }}
          aria-expanded={leadsOpen}
        >
          <div className="nav-item-left">
            <span className="nav-icon"><i className="fas fa-filter"></i></span>
            <span className="nav-label">Leads</span>
          </div>
          <span className="nav-arrow">
            <i className={`fas fa-chevron-${leadsOpen ? 'down' : 'right'}`}></i>
          </span>
        </div>

        {/* Leads Sub-menu */}
        <div className={`nav-sub${leadsOpen ? ' open' : ''}`}>
          {leadsSubItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <div className="nav-item-left">
                <span className="nav-icon"><i className="fas fa-circle" style={{ fontSize: '0.4rem' }}></i></span>
                <span className="nav-label">{item.label}</span>
              </div>
              {item.count && <span className="nav-count">{item.count}</span>}
            </NavLink>
          ))}
        </div>

        {/* Itineraries */}
        <NavLink
          to="/packages"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <div className="nav-item-left">
            <span className="nav-icon"><i className="fas fa-map-marked-alt"></i></span>
            <span className="nav-label">Itineraries</span>
          </div>
        </NavLink>

        {/* Static nav items */}
        {[
          { icon: 'fa-star',            label: 'Google Reviews' },
          { icon: 'fa-ticket-alt',      label: 'Vouchers'       },
          { icon: 'fa-file-invoice-dollar', label: 'Accounts'   },
          { icon: 'fa-chart-bar',       label: 'Reports'        },
        ].map(item => (
          <a key={item.label} href="#" className="nav-item">
            <div className="nav-item-left">
              <span className="nav-icon"><i className={`fas ${item.icon}`}></i></span>
              <span className="nav-label">{item.label}</span>
            </div>
          </a>
        ))}

        {/* Customer Support */}
        <NavLink
          to="/contact"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <div className="nav-item-left">
            <span className="nav-icon"><i className="fas fa-headset"></i></span>
            <span className="nav-label">Customer Support</span>
          </div>
        </NavLink>

        {/* ── User Control ─────────────────────── */}
        <div className="nav-group-label">User Control</div>
        {adminItems.map(item => (
          <a key={item.label} href="#" className="nav-item">
            <div className="nav-item-left">
              <span className="nav-icon"><i className={`fas ${item.icon}`}></i></span>
              <span className="nav-label">{item.label}</span>
            </div>
          </a>
        ))}

        {/* ── Participants ─────────────────────── */}
        <div className="nav-group-label">Participants</div>
        {[
          { icon: 'fa-user-friends', label: 'Itinerary Customers' },
          { icon: 'fa-handshake',    label: 'Partners'            },
          { icon: 'fa-truck',        label: 'Suppliers'           },
        ].map(item => (
          <a key={item.label} href="#" className="nav-item">
            <div className="nav-item-left">
              <span className="nav-icon"><i className={`fas ${item.icon}`}></i></span>
              <span className="nav-label">{item.label}</span>
            </div>
          </a>
        ))}

        <div className="nav-group-label">Miscellaneous</div>
        <a href="#" className="nav-item">
          <div className="nav-item-left">
            <span className="nav-icon"><i className="fas fa-ellipsis-h"></i></span>
            <span className="nav-label">More</span>
          </div>
        </a>
      </nav>

      {/* ── Footer (user info) ───────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">{getInitials(user?.name)}</div>
        <div className="sidebar-user-info">
          <div className="name">{user?.name}</div>
          <div className="role">Travel Manager</div>
        </div>

        <button
          className="sidebar-logout-btn"
          title="Logout"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
}
