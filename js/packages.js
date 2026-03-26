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
          <div class="empty-icon" style="font-size:2.5rem; opacity:0.3;"><i class="fas fa-plane"></i></div>
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

  // Maps airline names to the exact image files the user dropped into assets/images/
  const airlineLogoMap = {
    'Air India Express': 'assets/images/air_india_express.png',
    'Air India':         'assets/images/air_india.png',
    'Indigo':            'assets/images/indigo.jpg',
    'Star Air':          'assets/images/star_air.jpg',
    'Emirates':          'assets/images/emirates.png',
    'Thai Airways':      'assets/images/thai-airways.png',
  };

  // Builds a single package card DOM element matching the reference design
  function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.setAttribute('role', 'listitem');

    const logoSrc = pkg.airline ? (airlineLogoMap[pkg.airline] || '') : '';

    // Pricing tiers based on base price
    const publishPrice  = pkg.price;
    const flexPrice     = pkg.price;                         // same tier in sample data
    const xpressPrice   = Math.round(pkg.price * 2.19);     // approx XpressBiz markup

    const fmt = v => `₹${v.toLocaleString('en-IN')}`;

    // Seats note + nearby airport note (static sample values)
    const seatsNote = pkg.seatsLeft
      ? `<span class="pc-seats">${pkg.seatsLeft} seat(s) left</span>`
      : `<span class="pc-seats">9 seat(s) left</span>`;
    const airportNote = `<span class="pc-airport-note">Nearby Airport</span>`;

    const flightBlock = pkg.withFlights && pkg.airline ? `
      <!-- Row 1: Airline info + flight timing -->
      <div class="pc-flight-row">

        <!-- Left: Logo + name + flight number -->
        <div class="pc-airline">
          <div class="pc-logo">
            <img src="${logoSrc}" alt="${pkg.airline}"
                 onerror="this.style.display='none'" />
          </div>
          <div class="pc-airline-text">
            <span class="pc-airline-name">${pkg.airline}</span>
            <span class="pc-flight-num">${pkg.flightNo || ''}</span>
          </div>
        </div>

        <!-- Departure -->
        <div class="pc-dep">
          <span class="pc-time">${pkg.depTime}</span>
          <span class="pc-code">${pkg.depCode}</span>
        </div>

        <!-- Duration + notes -->
        <div class="pc-duration">
          <span class="pc-dur-text"><i class="far fa-clock"></i> ${pkg.duration}</span>
          <div class="pc-dur-line"></div>
          <div class="pc-dur-notes">${seatsNote}${airportNote}</div>
        </div>

        <!-- Arrival -->
        <div class="pc-arr">
          <span class="pc-time">${pkg.arrTime}</span>
          <span class="pc-code">${pkg.arrCode}</span>
        </div>

      </div>

      <hr class="pc-sep" />

      <!-- Row 2: Pricing tiers -->
      <div class="pc-pricing-row">
        <label class="pc-tier pc-tier--checked">
          <input type="checkbox" checked />
          <span class="pc-tier-price">${fmt(publishPrice)}</span>
          <span class="pc-tier-label pc-tier-label--publish">Publish</span>
        </label>
        <label class="pc-tier">
          <input type="checkbox" />
          <span class="pc-tier-price">${fmt(flexPrice)}</span>
          <span class="pc-tier-label pc-tier-label--flex">Flex</span>
        </label>
        <label class="pc-tier">
          <input type="checkbox" />
          <span class="pc-tier-price">${fmt(xpressPrice)}</span>
          <span class="pc-tier-label pc-tier-label--xpress">XpressBiz</span>
        </label>
      </div>

      <hr class="pc-sep" />

      <!-- Row 3: Baggage / refund / rules -->
      <div class="pc-info-row">
        <span class="pc-info-item">
          <i class="fas fa-shopping-bag"></i> Hand Baggage - ${pkg.handBaggage || '7 Kg'}
        </span>
        <span class="pc-info-sep">|</span>
        <span class="pc-info-item">
          <i class="fas fa-suitcase"></i> Check-In Baggage
        </span>
        <span class="pc-info-sep">|</span>
        <span class="pc-info-item ${pkg.refundable ? '' : 'pc-non-refund'}">
          <i class="fas fa-${pkg.refundable ? 'undo-alt' : 'times-circle'}"></i>
          ${pkg.refundable ? 'Refundable' : 'Non-Refundable'}
        </span>
        <span class="pc-info-sep">|</span>
        <span class="pc-info-item pc-rules">
          <i class="fas fa-info-circle"></i> Rules
        </span>
      </div>` :
      `<div class="pc-no-flight">
         <i class="fas fa-bus"></i> Land package — no flights included
       </div>`;

    card.innerHTML = flightBlock;

    // Book Now click stores package and navigates
    card.addEventListener('click', (e) => {
      if (e.target.closest('input, label')) return; // let checkboxes work normally
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
