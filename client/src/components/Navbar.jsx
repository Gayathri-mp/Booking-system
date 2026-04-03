import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/':         'Dashboard',
  '/packages': 'Itineraries',
  '/booking':  'Booking',
  '/contact':  'Customer Support',
};

export default function Navbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'HolidayBook';

  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <div className="navbar-title">{title}</div>
        <div className="navbar-search">
          <span className="search-icon"><i className="fas fa-search"></i></span>
          <input type="search" placeholder="Search destinations, bookings…" aria-label="Search" />
        </div>
      </div>
      <div className="navbar-right">
        <button className="icon-btn" title="Notifications" aria-label="Notifications">
          <i className="fas fa-bell"></i>
          <span className="badge"></span>
        </button>
        <button className="icon-btn" title="Messages" aria-label="Messages">
          <i className="fas fa-envelope"></i>
        </button>
        <div className="user-avatar" tabIndex={0} role="button" aria-label="User menu">
          <img
            src="https://ui-avatars.com/api/?name=Girish+Kumar&background=111111&color=fff&size=64"
            alt="User avatar"
          />
          <span className="user-name">Girish Kumar</span>
          <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}></i>
        </div>
      </div>
    </header>
  );
}
