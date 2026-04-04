import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authContext';

export default function Signup({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      showToast('Welcome to Voyager\'s Compass!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please check your data.', 'error');
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
            <h2>Create an Account</h2>
            <p>Sign up to start booking your dream holiday.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Gayathri"
                required
              />
            </div>
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
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in here</Link>
          </div>
        </div>
      </div>

      {/* Right: Brand */}
      <div className="auth-brand-side">
        <div className="auth-brand-content">
          <img src="/logo.png" alt="Voyager's Compass" className="auth-logo-large" />
          <h1>Voyager's Compass</h1>
          <p>Join the future of holiday booking today.</p>
        </div>
      </div>
    </div>
  );
}
