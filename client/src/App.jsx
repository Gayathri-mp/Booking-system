import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard  from './pages/Dashboard';
import Packages   from './pages/Packages';
import Booking    from './pages/Booking';
import Contact    from './pages/Contact';
import Sidebar    from './components/Sidebar';
import Navbar     from './components/Navbar';
import Toast      from './components/Toast';
import { useState } from 'react';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <main className="page-body" id="main" role="main">
            <Routes>
              <Route path="/"          element={<Dashboard  showToast={showToast} />} />
              <Route path="/packages"  element={<Packages   showToast={showToast} />} />
              <Route path="/booking"   element={<Booking    showToast={showToast} />} />
              <Route path="/contact"   element={<Contact    showToast={showToast} />} />
              <Route path="*"          element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </BrowserRouter>
  );
}
