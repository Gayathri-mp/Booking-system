import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authContext';

export default function Login({ showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Voyager\'s Compass!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left: Form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to manage your holiday bookings.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Log In'}
            </button>
          </form>
          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up for free</Link>
          </div>
        </div>
      </div>

      {/* Right: Brand */}
      <div className="auth-brand-side">
        <div className="auth-brand-content">
          <img src="/logo.png" alt="Voyager's Compass" className="auth-logo-large" />
          <h1>Voyager's Compass</h1>
          <p>The ultimate holiday booking companion.</p>
        </div>
      </div>
    </div>
  );
}
