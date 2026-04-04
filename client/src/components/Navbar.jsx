import { useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const pageTitles = {
  '/':         'Dashboard',
  '/packages': 'Itineraries',
  '/booking':  'Booking',
  '/contact':  'Customer Support',
};

// ── Static demo data ─────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, icon: 'fa-check-circle', color: '#2d7a4f', title: 'Booking Confirmed',        sub: 'VC-AB3CD7 — Goa package confirmed',     time: '2 min ago',  unread: true  },
  { id: 2, icon: 'fa-plane',        color: '#2563eb', title: 'New Package Available',    sub: 'Kashmir Winter Special just added',       time: '1 hr ago',   unread: true  },
  { id: 3, icon: 'fa-exclamation-triangle', color: '#e65100', title: 'Payment Pending', sub: 'Invoice #1042 awaiting payment',          time: '3 hrs ago',  unread: false },
  { id: 4, icon: 'fa-star',         color: '#f0c040', title: 'Review Request',           sub: 'Rate your recent Kerala trip',            time: 'Yesterday',  unread: false },
];

const MESSAGES = [
  { id: 1, from: 'Rajesh Kumar',  avatar: 'RK', sub: 'Hi, I need help with my booking…',  time: '5 min ago',  unread: true  },
  { id: 2, from: 'Priya Sharma',  avatar: 'PS', sub: 'Can I reschedule the Goa trip?',    time: '30 min ago', unread: true  },
  { id: 3, from: 'Arun Mehta',    avatar: 'AM', sub: 'Thank you for the quick response!', time: '2 hrs ago',  unread: false },
  { id: 4, from: 'Support Team',  avatar: 'ST', sub: 'Your ticket #2041 has been resolved', time: 'Yesterday', unread: false },
];

// ── Helper: close dropdown on outside click ──────────────────────
function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [ref, handler]);
}

// ── Dropdown wrapper ─────────────────────────────────────────────
function Dropdown({ open, children, width = 340 }) {
  if (!open) return null;
  return (
    <div className="nb-dropdown" style={{ width }}>
      {children}
    </div>
  );
}

// ── Main Navbar ──────────────────────────────────────────────────
export default function Navbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Voyager's Compass";

  const [openPanel, setOpenPanel] = useState(null); // 'notif' | 'msg' | 'profile'
  const [notifs,    setNotifs]    = useState(NOTIFICATIONS);
  const [messages,  setMessages]  = useState(MESSAGES);

  const wrapRef = useRef(null);
  useClickOutside(wrapRef, () => setOpenPanel(null));

  const toggle = panel => setOpenPanel(p => p === panel ? null : panel);

  const unreadNotifs   = notifs.filter(n => n.unread).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  const markAllNotifsRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));
  const markAllMsgsRead   = () => setMessages(m => m.map(x => ({ ...x, unread: false })));

  return (
    <header className="navbar" role="banner" ref={wrapRef}>
      {/* ── Left ─────────────────────── */}
      <div className="navbar-left">
        <div className="navbar-title">{title}</div>
        <div className="navbar-search">
          <span className="search-icon"><i className="fas fa-search"></i></span>
          <input type="search" placeholder="Search destinations, bookings…" aria-label="Search" />
        </div>
      </div>

      {/* ── Right ────────────────────── */}
      <div className="navbar-right">

        {/* ── Notifications ── */}
        <div className="nb-icon-wrap" style={{ position: 'relative' }}>
          <button
            className={`icon-btn${openPanel === 'notif' ? ' active' : ''}`}
            title="Notifications" aria-label="Notifications"
            onClick={() => toggle('notif')}
          >
            <i className="fas fa-bell"></i>
            {unreadNotifs > 0 && <span className="nb-badge">{unreadNotifs}</span>}
          </button>

          <Dropdown open={openPanel === 'notif'}>
            <div className="nb-dropdown-header">
              <strong>Notifications</strong>
              {unreadNotifs > 0 && (
                <button className="nb-mark-all" onClick={markAllNotifsRead}>Mark all read</button>
              )}
            </div>
            <div className="nb-list">
              {notifs.map(n => (
                <div key={n.id} className={`nb-item${n.unread ? ' nb-item--unread' : ''}`}>
                  <div className="nb-item-icon" style={{ color: n.color, background: n.color + '18' }}>
                    <i className={`fas ${n.icon}`}></i>
                  </div>
                  <div className="nb-item-body">
                    <div className="nb-item-title">{n.title}</div>
                    <div className="nb-item-sub">{n.sub}</div>
                    <div className="nb-item-time">{n.time}</div>
                  </div>
                  {n.unread && <span className="nb-dot"></span>}
                </div>
              ))}
            </div>
            <div className="nb-dropdown-footer">
              <button className="nb-view-all">View all notifications <i className="fas fa-arrow-right"></i></button>
            </div>
          </Dropdown>
        </div>

        {/* ── Messages ── */}
        <div className="nb-icon-wrap" style={{ position: 'relative' }}>
          <button
            className={`icon-btn${openPanel === 'msg' ? ' active' : ''}`}
            title="Messages" aria-label="Messages"
            onClick={() => toggle('msg')}
          >
            <i className="fas fa-envelope"></i>
            {unreadMessages > 0 && <span className="nb-badge">{unreadMessages}</span>}
          </button>

          <Dropdown open={openPanel === 'msg'}>
            <div className="nb-dropdown-header">
              <strong>Messages</strong>
              {unreadMessages > 0 && (
                <button className="nb-mark-all" onClick={markAllMsgsRead}>Mark all read</button>
              )}
            </div>
            <div className="nb-list">
              {messages.map(m => (
                <div key={m.id} className={`nb-item${m.unread ? ' nb-item--unread' : ''}`}>
                  <div className="nb-msg-avatar">{m.avatar}</div>
                  <div className="nb-item-body">
                    <div className="nb-item-title">{m.from}</div>
                    <div className="nb-item-sub">{m.sub}</div>
                    <div className="nb-item-time">{m.time}</div>
                  </div>
                  {m.unread && <span className="nb-dot"></span>}
                </div>
              ))}
            </div>
            <div className="nb-dropdown-footer">
              <button className="nb-view-all">Open inbox <i className="fas fa-arrow-right"></i></button>
            </div>
          </Dropdown>
        </div>

        {/* ── User Profile ── */}
        <div className="nb-icon-wrap" style={{ position: 'relative' }}>
          <div
            className="user-avatar"
            tabIndex={0} role="button" aria-label="User menu"
            onClick={() => toggle('profile')}
            onKeyDown={e => e.key === 'Enter' && toggle('profile')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/avatar.png"
              alt="Gayathri"
              onError={e => { e.target.src = "https://ui-avatars.com/api/?name=Gayathri&background=111111&color=fff&size=64"; }}
            />
            <span className="user-name">Gayathri</span>
            <i className={`fas fa-chevron-${openPanel === 'profile' ? 'up' : 'down'}`}
               style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}></i>
          </div>

          <Dropdown open={openPanel === 'profile'} width={240}>
            {/* Profile header */}
            <div className="nb-profile-header">
              <img
                src="/avatar.png"
                alt="Gayathri"
                className="nb-profile-avatar"
                onError={e => { e.target.src = "https://ui-avatars.com/api/?name=Gayathri&background=111111&color=fff&size=64"; }}
              />
              <div>
                <div className="nb-profile-name">Gayathri</div>
                <div className="nb-profile-role">Travel Manager</div>
              </div>
            </div>
            <div className="nb-divider"></div>
            {[
              { icon: 'fa-user',        label: 'My Profile'       },
              { icon: 'fa-cog',         label: 'Account Settings' },
              { icon: 'fa-ticket-alt',  label: 'My Bookings'      },
              { icon: 'fa-bell',        label: 'Notifications'    },
            ].map(item => (
              <button key={item.label} className="nb-profile-item">
                <i className={`fas ${item.icon}`}></i> {item.label}
              </button>
            ))}
            <div className="nb-divider"></div>
            <button className="nb-profile-item nb-profile-logout">
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </Dropdown>
        </div>

      </div>
    </header>
  );
}
