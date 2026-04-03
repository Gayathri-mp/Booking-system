import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const airlineLogoMap = {
  'Air India Express': '/logos/air_india_express.png',
  'Air India':         '/logos/air_india.png',
  'Indigo':            '/logos/indigo.jpg',
  'Star Air':          '/logos/star_air.jpg',
};

function PackageCard({ pkg }) {
  const navigate = useNavigate();
  const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`;

  const handleClick = (e) => {
    if (e.target.closest('input, label')) return;
    sessionStorage.setItem('selectedPackage', JSON.stringify(pkg));
    navigate('/booking');
  };

  const durLabel = pkg.overnight
    ? `${pkg.duration} +1D`
    : pkg.duration;

  return (
    <div className="package-card" role="listitem" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {pkg.withFlights && pkg.airline ? (
        <>
          <div className="pc-flight-row">
            <div className="pc-airline">
              <div className="pc-logo">
                <img src={airlineLogoMap[pkg.airline] || ''} alt={pkg.airline} onError={e => e.target.style.display = 'none'} />
              </div>
              <div className="pc-airline-text">
                <span className="pc-airline-name">{pkg.airline}</span>
                <span className="pc-flight-num">{pkg.flightNo}</span>
              </div>
            </div>
            <div className="pc-dep">
              <span className="pc-time">{pkg.depTime}</span>
              <span className="pc-code">{pkg.depCode}</span>
            </div>
            <div className="pc-duration">
              <span className="pc-dur-text"><i className="far fa-clock"></i> {durLabel}</span>
              <div className="pc-dur-line"></div>
              <div className="pc-dur-notes">
                {pkg.stops && <span className="pc-stops">{pkg.stops}</span>}
                {pkg.seatsLeft && <span className="pc-seats">{pkg.seatsLeft}</span>}
              </div>
            </div>
            <div className="pc-arr">
              <span className="pc-time">{pkg.arrTime}</span>
              <span className="pc-code">{pkg.arrCode}</span>
            </div>
          </div>
          <hr className="pc-sep" />
          <div className="pc-pricing-row">
            {(pkg.tiers || []).map((t, i) => (
              <label key={i} className={`pc-tier${t.checked ? ' pc-tier--checked' : ''}`}>
                <input type="checkbox" defaultChecked={t.checked} onClick={e => e.stopPropagation()} />
                <span className="pc-tier-price">{fmt(t.price)}</span>
                <span className={`pc-tier-label ${t.badgeClass}`}>{t.label}</span>
              </label>
            ))}
          </div>
          <hr className="pc-sep" />
          <div className="pc-info-row">
            <span className="pc-info-item"><i className="fas fa-shopping-bag"></i> Hand Baggage - {pkg.handBaggage || '7 Kg'}</span>
            <span className="pc-info-sep">|</span>
            <span className="pc-info-item"><i className="fas fa-suitcase"></i> Check-In Baggage</span>
            <span className="pc-info-sep">|</span>
            <span className={`pc-info-item${pkg.refundable ? '' : ' pc-non-refund'}`}>
              <i className={`fas fa-${pkg.refundable ? 'undo-alt' : 'times-circle'}`}></i>
              {pkg.refundable ? 'Refundable' : 'Non-Refundable'}
            </span>
            <span className="pc-info-sep">|</span>
            <span className="pc-info-item pc-rules"><i className="fas fa-info-circle"></i> Rules</span>
          </div>
        </>
      ) : (
        <div className="pc-no-flight"><i className="fas fa-bus"></i> Land package — no flights included</div>
      )}
    </div>
  );
}

export default function Packages({ showToast }) {
  const [packages, setPackages]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeType, setActiveType]   = useState('indian');
  const [flightMode, setFlightMode]   = useState('with');
  const [activeStars, setActiveStars] = useState([]);
  const [searchQ, setSearchQ]         = useState('');
  const [inputVal, setInputVal]       = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { type: activeType, withFlights: flightMode === 'with' };
    if (searchQ) params.destination = searchQ;

    api.get('/packages', { params })
      .then(res => setPackages(res.data))
      .catch(() => showToast('Failed to load packages', 'error'))
      .finally(() => setLoading(false));
  }, [activeType, flightMode, searchQ]);

  const filtered = activeStars.length > 0
    ? packages.filter(p => activeStars.includes(p.stars))
    : packages;

  const toggleStar = (s) => setActiveStars(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  return (
    <>
      <div className="page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
          <span>Itineraries</span>
        </nav>
        <h1>Holiday Packages</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar-card">
        <div className="search-fields">
          <div className="search-field">
            <label htmlFor="destination-input"><i className="fas fa-map-marker-alt"></i> Destination</label>
            <input
              id="destination-input"
              type="text"
              placeholder="Where do you want to go?"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearchQ(inputVal.trim())}
            />
          </div>
        </div>
        <button id="search-btn" className="btn-primary" onClick={() => setSearchQ(inputVal.trim())}>
          <i className="fas fa-search"></i> Search
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        <div className="type-tabs">
          {['indian', 'international'].map(t => (
            <button
              key={t}
              className={`type-tab-btn${activeType === t ? ' active' : ''}`}
              onClick={() => setActiveType(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flight-tabs">
          {['with', 'without'].map(m => (
            <button
              key={m}
              className={`flight-tab-btn${flightMode === m ? ' active' : ''}`}
              onClick={() => setFlightMode(m)}
            >
              {m === 'with' ? 'With Flights' : 'Without Flights'}
            </button>
          ))}
        </div>
        <div className="star-filter">
          {[3, 4, 5].map(s => (
            <button
              key={s}
              className={`star-btn${activeStars.includes(s) ? ' active' : ''}`}
              onClick={() => toggleStar(s)}
            >
              {'★'.repeat(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading packages…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fas fa-plane"></i></div>
          <h3>No packages found</h3>
          <p>Try adjusting your filters or search for a different destination.</p>
        </div>
      ) : (
        <div id="packages-grid" className="packages-grid" role="list">
          {filtered.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
        </div>
      )}
    </>
  );
}
