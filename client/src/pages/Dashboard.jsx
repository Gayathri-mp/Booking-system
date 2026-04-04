import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const stats = [
  { icon: 'fa-suitcase-rolling', color: 'blue',   label: 'Total Bookings',       value: '1,248', change: '12% this month',    dir: 'up' },
  { icon: 'fa-map-marked-alt',   color: 'green',  label: 'Active Packages',      value: '84',    change: '6 new added',        dir: 'up' },
  { icon: 'fa-rupee-sign',       color: 'amber',  label: 'Revenue (This Month)', value: 'Rs.24.6L', change: '8.4% vs last month', dir: 'up' },
  { icon: 'fa-star',             color: 'orange', label: 'Avg. Rating',          value: '4.7 / 5',  change: '0.2 from last month', dir: 'up' },
];

export default function Dashboard({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings')
      .then(res => setBookings(res.data.slice(0, 5)))
      .catch(() => {}); // graceful — show empty if backend not running
  }, []);

  const statusClass = s => ({ confirmed: 'confirmed', pending: 'pending', cancelled: 'cancelled' }[s] || 'pending');

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
          <span>Dashboard</span>
        </nav>
        <h1>Dashboard</h1>
        <p>Welcome back, Gayathri! Here's what's happening today.</p>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner" role="region" aria-label="Promotional banner">
        <div className="hero-content">
          <div className="tag">Summer 2026 Sale</div>
          <h2>Discover India's Hidden Gems</h2>
          <p>Exclusive holiday packages at unbeatable prices. Book now and save up to 40% on premium resorts across India and abroad.</p>
          <button className="btn-primary" onClick={() => navigate('/packages')}>
            <i className="fas fa-search"></i> Browse Packages
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" role="region" aria-label="Statistics">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}><i className={`fas ${s.icon}`}></i></div>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change ${s.dir}`}>
                <i className={`fas fa-arrow-${s.dir}`}></i> {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="section-header">
        <h2>Recent Bookings</h2>
        <span className="link-muted" onClick={() => navigate('/packages')} style={{ cursor: 'pointer' }}>View all →</span>
      </div>

      <div className="table-card" role="region" aria-label="Recent bookings table">
        {bookings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
            <p style={{ marginTop: '0.5rem' }}>No bookings yet. <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/packages')}>Browse packages</span></p>
          </div>
        ) : (
          <table aria-label="Recent bookings">
            <thead>
              <tr>
                <th>Booking ID</th><th>Customer</th><th>Destination</th>
                <th>Travel Date</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td className="font-semibold" style={{ color: '#333' }}>#{b.bookingRef}</td>
                  <td>{b.customerName}</td>
                  <td>{b.packageId?.destination || '—'}</td>
                  <td>{b.travelDate}</td>
                  <td className="font-semibold">₹{(b.packageId?.totalPrice || 0).toLocaleString('en-IN')}</td>
                  <td><span className={`pill ${statusClass(b.status)}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
