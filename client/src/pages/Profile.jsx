import { useEffect, useState } from 'react';
import { useAuth } from '../authContext';
import api from '../api';

export default function Profile({ showToast }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        // In a real app, the backend would filter by user ID. 
        // For now, we fetch all and show the personalized UI.
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        showToast('Failed to load your profile data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner"></div><p>Loading your profile...</p></div>;

  return (
    <>
      <div className="page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
          <span>Account Settings</span>
        </nav>
        <h1>My Profile</h1>
        <p>Manage your account details and view your travel history.</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form-card">
          <div className="step-panel">
            <h3>Account Information</h3>
            <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
              <div className="info-box">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Full Name</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>{user?.name}</div>
              </div>
              <div className="info-box">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Email Address</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>{user?.email}</div>
              </div>
              <div className="info-box">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Member Since</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>April 2024</div>
              </div>
              <div className="info-box">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Account Level</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--success)' }}>Travel Manager</div>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button className="btn-outline">Edit Profile</button>
              <button className="btn-primary">Update Password</button>
            </div>
          </div>
        </div>

        <div className="booking-summary-card">
          <h3>Your Recent Bookings</h3>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="fas fa-plane-departure" style={{ fontSize: '2rem', opacity: 0.1, marginBottom: '1rem' }}></i>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No bookings found yet.</p>
            </div>
          ) : (
            <div className="mini-booking-list">
              {bookings.slice(0, 3).map(b => (
                <div key={b._id} className="sum-row" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{b.packageId?.destination || 'Package Booking'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ref: {b.bookingRef}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`badge ${b.status === 'confirmed' ? 'badge--success' : 'badge--warning'}`} style={{ fontSize: '0.65rem' }}>{b.status}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button className="nb-view-all" style={{ fontSize: '0.8rem' }}>View all bookings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
