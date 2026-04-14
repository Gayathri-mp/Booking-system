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
    <div className="auth-container auth-dark-theme">
      {/* Left: Image Side */}
      <div className="auth-image-side">
      </div>

      {/* Right: Form Side */}
      <div className="auth-form-side">
        <div className="auth-card auth-animate-up">
          <div className="auth-header lux-header">
            <h2>Welcome Back.</h2>
            <p>Access your digital reality.</p>
          </div>
          <form onSubmit={handleSubmit} className="lux-form">
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
                placeholder="••••••••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-lux" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Enter the Portal'}
            </button>
          </form>
          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Begin your journey</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
