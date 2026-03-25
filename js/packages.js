/*
  packages.js — Search, filter, tab switching for packages.html
  Holiday Package Booking System
*/

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sample Package Data ----
  // In a real app these would come from an API or backend.
  // To add more packages, just add another object to this array.
  const packages = [
    {
      id: 1,
      type: 'indian',
      withFlights: true,
      destination: 'Goa',
      stars: 3,
      airline: 'Air India Express',
      flightNo: '6E 2879 1C',
      depTime: '12:05',
      arrTime: '13:30',
      duration: '2h 15m',
      depCode: 'HYD',
      arrCode: 'GOX',
      price: 13300,
      totalPrice: 105300,
      roundTrip: 210600,
      refundable: true,
      handBaggage: '7 Kg',
      checkInBaggage: true,
      hasMeal: false,
    },
    {
      id: 2,
      type: 'indian',
      withFlights: true,
      destination: 'Goa',
      stars: 4,
      airline: 'Air India',
      flightNo: '6E 2879 1C',
      depTime: '11:30',
      arrTime: '18:55',
      duration: '7h 25m',
      depCode: 'HYD',
      arrCode: 'GOX',
      price: 13300,
      totalPrice: 105300,
      roundTrip: 210600,
      refundable: false,
      handBaggage: '7 Kg',
      checkInBaggage: true,
      hasMeal: true,
    },
    {
      id: 3,
      type: 'indian',
      withFlights: true,
      destination: 'Manali',
      stars: 5,
      airline: 'Indigo',
      flightNo: '6E 416 | 6E 6944 5M',
      depTime: '20:50',
      arrTime: '06:20',
      duration: '9h 30m',
      depCode: 'HYD',
      arrCode: 'KUU',
      price: 13300,
      totalPrice: 125000,
      roundTrip: 248000,
      refundable: true,
      handBaggage: '7 Kg',
      checkInBaggage: true,
      hasMeal: false,
    },
    {
      id: 4,
      type: 'indian',
      withFlights: true,
      destination: 'Kerala',
      stars: 4,
      airline: 'Star Air',
      flightNo: '5S 212 1G1 | 5S 210 1G2',
      depTime: '09:50',
      arrTime: '17:55',
      duration: '8h 05m',
      depCode: 'HYD',
      arrCode: 'CCJ',
      price: 13300,
      totalPrice: 98000,
      roundTrip: 194000,
      refundable: false,
      handBaggage: '7 Kg',
      checkInBaggage: true,
      hasMeal: false,
    },
    {
      id: 5,
      type: 'international',
      withFlights: true,
      destination: 'Dubai',
      stars: 5,
      airline: 'Emirates',
      flightNo: 'EK 524',
      depTime: '23:40',
      arrTime: '01:20',
      duration: '3h 40m',
      depCode: 'HYD',
      arrCode: 'DXB',
      price: 28500,
      totalPrice: 185000,
      roundTrip: 368000,
      refundable: true,
      handBaggage: '7 Kg',
      checkInBaggage: true,
      hasMeal: true,
    },
    {
      id: 6,
      type: 'international',
      withFlights: true,
      destination: 'Bangkok',
      stars: 4,
      airline: 'Thai Airways',
      flightNo: 'TG 317',
      depTime: '08:15',
      arrTime: '14:30',
      duration: '4h 15m',
      depCode: 'HYD',
      arrCode: 'BKK',
      price: 22000,
      totalPrice: 145000,
      roundTrip: 288000,
      refundable: false,
      handBaggage: '7 Kg',
      checkInBaggage: false,
      hasMeal: true,
    },
    {
      id: 7,
      type: 'indian',
      withFlights: false,
      destination: 'Shimla',
      stars: 3,
      airline: null,
      price: 8500,
      totalPrice: 65000,
      roundTrip: null,
      refundable: false,
      handBaggage: null,
      checkInBaggage: false,
      hasMeal: true,
    },
    {
      id: 8,
      type: 'international',
      withFlights: false,
      destination: 'Maldives',
      stars: 5,
      airline: null,
      price: 55000,
      totalPrice: 310000,
      roundTrip: null,
      refundable: true,
      handBaggage: null,
      checkInBaggage: false,
      hasMeal: true,
    },
  ];

  // ---- State Variables ----
  let activeType       = 'indian';       // 'indian' or 'international'
  let activeFlightMode = 'with';         // 'with' or 'without'
  let activeStars      = [];             // array of star ratings selected (e.g. [3, 4])
  let addLunch         = false;
  let addDinner        = false;
  let searchQuery      = '';

  // ---- DOM References ----
  const typeTabs        = document.querySelectorAll('.type-tab-btn');
  const flightTabs      = document.querySelectorAll('.flight-tab-btn');
  const starBtns        = document.querySelectorAll('.star-btn');
  const lunchCheckbox   = document.getElementById('add-lunch');
  const dinnerCheckbox  = document.getElementById('add-dinner');
  const searchInput     = document.getElementById('destination-input');
  const dateInput       = document.getElementById('date-input');
  const passInput       = document.getElementById('passengers-select');
  const searchSubmitBtn = document.getElementById('search-btn');
  const resultsGrid     = document.getElementById('packages-grid');

  // ---- Rendering ----
  function renderPackages() {
    if (!resultsGrid) return;

    // Apply all active filters
    let filtered = packages.filter(pkg => {
      const matchType   = pkg.type === activeType;
      const matchFlight = activeFlightMode === 'with' ? pkg.withFlights : !pkg.withFlights;
      const matchStars  = activeStars.length === 0 || activeStars.includes(pkg.stars);
      const matchSearch = searchQuery === '' ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMeal   = (!addLunch && !addDinner) || pkg.hasMeal;

      return matchType && matchFlight && matchStars && matchSearch && matchMeal;
    });

    resultsGrid.innerHTML = ''; // clear existing cards

    if (filtered.length === 0) {
      resultsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✈️</div>
          <h3>No packages found</h3>
          <p>Try adjusting your filters or search for a different destination.</p>
        </div>`;
      return;
    }

    filtered.forEach(pkg => {
      const card = createPackageCard(pkg);
      resultsGrid.appendChild(card);
    });
  }

  // Builds a single package card DOM element
  function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${pkg.destination} package`);

    const totalDisplay = pkg.roundTrip
      ? `₹${pkg.roundTrip.toLocaleString('en-IN')}`
      : `₹${pkg.totalPrice.toLocaleString('en-IN')}`;

    const flightSection = pkg.withFlights && pkg.airline ? `
      <div class="flight-row">
        <div class="airline-logo">✈</div>
        <div class="airline-info">
          <div class="airline-name">${pkg.airline}</div>
          <div class="flight-number">${pkg.flightNo || ''}</div>
        </div>
        <div class="flight-times">
          <span class="flight-time">${pkg.depTime}</span>
          <div class="flight-duration">
            <span>${pkg.duration}</span>
            <div class="duration-line"></div>
          </div>
          <span class="flight-time">${pkg.arrTime}</span>
        </div>
        <div class="flight-price">
          <div class="price-main">₹${pkg.price.toLocaleString('en-IN')}</div>
          <div class="price-tag yellow">SALE</div>
        </div>
      </div>
      <div class="flight-badges">
        ${pkg.handBaggage ? `<span class="badge-item"><i>🧳</i> Hand Baggage - ${pkg.handBaggage}</span>` : ''}
        ${pkg.checkInBaggage ? `<span class="badge-item"><i>✔️</i> Check-in Baggage</span>` : ''}
        ${pkg.refundable     ? `<span class="badge-item"><i>↩️</i> Refundable</span>` : `<span class="badge-item text-danger"><i>✖️</i> Non-Refundable</span>`}
        ${pkg.hasMeal        ? `<span class="badge-item"><i>🍽️</i> Meal Included</span>` : ''}
      </div>` : `
      <div style="padding: 16px; color: var(--text-muted); font-size: 0.87rem;">
        🚌 Land package — no flights included
      </div>`;

    card.innerHTML = `
      <div class="card-price-bar">
        <div class="trip-label">
          📍 ${pkg.destination}&nbsp;&nbsp;
          ${'⭐'.repeat(pkg.stars)}
        </div>
        <div class="trip-price">From ₹${pkg.totalPrice.toLocaleString('en-IN')}</div>
        ${pkg.roundTrip ? `<div class="total-price">Round Trip ${totalDisplay}</div>` : ''}
      </div>
      <div class="flight-rows">
        ${flightSection}
      </div>
      <div class="card-footer">
        <div>
          <div class="total-label">Total Package Price</div>
          <div class="total-price">₹${pkg.totalPrice.toLocaleString('en-IN')}</div>
          <div class="total-sub">Per person (taxes incl.)</div>
        </div>
        <button class="btn-solid book-btn" data-id="${pkg.id}">Book Now →</button>
      </div>`;

    // Navigate to booking page when "Book Now" is clicked
    card.querySelector('.book-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      // Save selected package info to sessionStorage for the booking page
      sessionStorage.setItem('selectedPackage', JSON.stringify(pkg));
      window.location.href = 'booking.html';
    });

    // Also navigate if the card itself is clicked
    card.addEventListener('click', () => {
      sessionStorage.setItem('selectedPackage', JSON.stringify(pkg));
      window.location.href = 'booking.html';
    });

    return card;
  }

  // ---- Event Listeners ----

  // Holiday type tabs (Indian / International)
  typeTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      typeTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.type;
      renderPackages();
    });
  });

  // Flight / No-flight sub-tabs
  flightTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      flightTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFlightMode = btn.dataset.mode;
      renderPackages();
    });
  });

  // Star filter buttons — allow multi-select
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stars = parseInt(btn.dataset.stars);
      btn.classList.toggle('active');

      if (activeStars.includes(stars)) {
        activeStars = activeStars.filter(s => s !== stars);
      } else {
        activeStars.push(stars);
      }

      renderPackages();
    });
  });

  // Meal checkboxes
  if (lunchCheckbox)  lunchCheckbox.addEventListener('change',  () => { addLunch  = lunchCheckbox.checked;  renderPackages(); });
  if (dinnerCheckbox) dinnerCheckbox.addEventListener('change', () => { addDinner = dinnerCheckbox.checked; renderPackages(); });

  // Search button click
  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', () => {
      searchQuery = searchInput ? searchInput.value.trim() : '';
      renderPackages();
    });
  }

  // Also search on Enter key
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchQuery = searchInput.value.trim();
        renderPackages();
      }
    });
  }

  // Initial render when page loads
  renderPackages();

});
