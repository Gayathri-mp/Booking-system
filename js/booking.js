/*
  booking.js — Multi-step booking form, validation & confirmation modal
  Holiday Package Booking System
*/

document.addEventListener('DOMContentLoaded', () => {

  // ---- Load Selected Package from packages.html ----
  // The package data was stored by packages.js when the user clicked "Book Now"
  const rawPkg = sessionStorage.getItem('selectedPackage');
  const pkg = rawPkg ? JSON.parse(rawPkg) : null;

  // Fill booking summary sidebar
  const summaryDestEl = document.getElementById('sum-destination');
  const summaryStarsEl = document.getElementById('sum-stars');
  const summaryTypeEl  = document.getElementById('sum-type');
  const summaryPriceEl = document.getElementById('sum-price');
  const summaryTotalEl = document.getElementById('sum-total');

  if (pkg) {
    if (summaryDestEl)  summaryDestEl.textContent  = pkg.destination  || '—';
    if (summaryStarsEl) summaryStarsEl.textContent = '★'.repeat(pkg.stars || 0);
    if (summaryTypeEl)  summaryTypeEl.textContent  = pkg.type === 'international' ? 'International' : 'Indian';
    if (summaryPriceEl) summaryPriceEl.textContent = `₹${(pkg.price || 0).toLocaleString('en-IN')}`;
    if (summaryTotalEl) summaryTotalEl.textContent = `₹${(pkg.totalPrice || 0).toLocaleString('en-IN')}`;
  }

  // ---- Multi-Step Form State ----
  let currentStep = 1;
  const totalSteps = 3;

  const stepDots    = document.querySelectorAll('.step');
  const stepLines   = document.querySelectorAll('.step-line');
  const stepPanels  = document.querySelectorAll('.step-panel');
  const nextBtns    = document.querySelectorAll('.btn-next');
  const prevBtns    = document.querySelectorAll('.btn-prev');
  const submitBtn   = document.getElementById('submit-booking');

  function updateStepDisplay() {
    // Update the visual step indicator
    stepDots.forEach((step, idx) => {
      step.classList.remove('active', 'done');
      if (idx + 1 === currentStep) step.classList.add('active');
      if (idx + 1 < currentStep)   step.classList.add('done');
    });

    stepLines.forEach((line, idx) => {
      line.classList.toggle('done', idx + 1 < currentStep);
    });

    // Show only the current panel, hide the rest
    stepPanels.forEach((panel, idx) => {
      panel.classList.toggle('hidden', idx + 1 !== currentStep);
    });
  }

  function goToStep(step) {
    currentStep = Math.max(1, Math.min(step, totalSteps));
    updateStepDisplay();
    // Scroll back to top of form
    document.querySelector('.booking-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // "Next" buttons — validate before proceeding
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep()) goToStep(currentStep + 1);
    });
  });

  // "Back" buttons — always go back without validation
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  });

  // ---- Form Validation ----
  // Validates each required field in the currently visible step
  function validateCurrentStep() {
    const panel = document.querySelector(`.step-panel[data-step="${currentStep}"]`);
    if (!panel) return true;

    const requiredFields = panel.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      const errorEl = group?.querySelector('.error-msg');
      const value = field.value.trim();

      // Reset previous error state
      group?.classList.remove('has-error');

      // Check empty values
      if (!value) {
        group?.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'This field is required.';
        isValid = false;
        return;
      }

      // Check email format
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          group?.classList.add('has-error');
          if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
          isValid = false;
          return;
        }
      }

      // Check phone format (10 digits)
      if (field.type === 'tel') {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
          group?.classList.add('has-error');
          if (errorEl) errorEl.textContent = 'Enter a valid 10-digit mobile number.';
          isValid = false;
          return;
        }
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = panel.querySelector('.has-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof showToast === 'function') showToast('Please fix the errors before continuing.', 'error');
    }

    return isValid;
  }

  // Clear error styling when user starts typing in a field
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-group')?.classList.remove('has-error');
    });
  });

  // ---- Final Form Submission ----
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!validateCurrentStep()) return;

      // Generate a random booking reference for demo purposes
      const ref = 'HB' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const refEl = document.getElementById('booking-ref');
      if (refEl) refEl.textContent = ref;

      // Show the success modal
      showConfirmationModal();

      // Clear the session storage so the same package isn't accidentally re-booked
      sessionStorage.removeItem('selectedPackage');
    });
  }

  // ---- Confirmation Modal ----
  const modal    = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const doneBtn  = document.getElementById('modal-done-btn');

  function showConfirmationModal() {
    if (modal) modal.classList.add('open');
  }

  function hideConfirmationModal() {
    if (modal) modal.classList.remove('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', hideConfirmationModal);

  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      hideConfirmationModal();
      window.location.href = 'index.html'; // go back to dashboard
    });
  }

  // Close modal if user clicks the dark backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideConfirmationModal();
    });
  }

  // ---- Traveller Count (add/remove traveller rows) ----
  const addTravellerBtn = document.getElementById('add-traveller');
  const travellerList   = document.getElementById('traveller-list');
  let travellerCount = 1;

  if (addTravellerBtn && travellerList) {
    addTravellerBtn.addEventListener('click', () => {
      if (travellerCount >= 6) {
        if (typeof showToast === 'function') showToast('Maximum 6 travellers allowed.', 'error');
        return;
      }
      travellerCount++;
      const row = document.createElement('div');
      row.className = 'traveller-row form-grid';
      row.innerHTML = `
        <div class="form-group">
          <label>First Name (Traveller ${travellerCount})</label>
          <input type="text" placeholder="First name" required>
          <span class="error-msg">This field is required.</span>
        </div>
        <div class="form-group">
          <label>Last Name (Traveller ${travellerCount})</label>
          <input type="text" placeholder="Last name" required>
          <span class="error-msg">This field is required.</span>
        </div>
        <div class="form-group">
          <label>Age</label>
          <input type="number" placeholder="Age" min="1" max="100" required>
          <span class="error-msg">This field is required.</span>
        </div>
        <div class="form-group" style="align-self: end; padding-bottom: 4px;">
          <button class="btn-outline remove-traveller" type="button">Remove</button>
        </div>`;

      // Wire up the remove button
      row.querySelector('.remove-traveller').addEventListener('click', () => {
        row.remove();
        travellerCount--;
      });

      travellerList.appendChild(row);
    });
  }

  // ---- Initialize step display on page load ----
  updateStepDisplay();

});
