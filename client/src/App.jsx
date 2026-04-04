import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './authContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Leads from './pages/Leads';

// ── Protected Route Wrapper ─────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

// ── Root App Content ───────────────────────────────────────────
function AppContent() {
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login showToast={showToast} />} />
        <Route path="/signup" element={<Signup showToast={showToast} />} />

        {/* Protected Routes */}
        <Route path="/"                element={<ProtectedRoute><Dashboard showToast={showToast} /></ProtectedRoute>} />
        <Route path="/packages"       element={<ProtectedRoute><Packages  showToast={showToast} /></ProtectedRoute>} />
        <Route path="/booking"        element={<ProtectedRoute><Booking   showToast={showToast} /></ProtectedRoute>} />
        <Route path="/contact"        element={<ProtectedRoute><Contact   showToast={showToast} /></ProtectedRoute>} />
        <Route path="/leads"          element={<ProtectedRoute><Leads     showToast={showToast} /></ProtectedRoute>} />
        
        {/* Redirect unknown to home (which will redirect to login if needed) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>


      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

// ── Main App Component ─────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
