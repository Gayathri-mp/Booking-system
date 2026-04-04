import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TOTAL_STEPS = 4;

/* ── Validation ──────────────────────────────────────────────── */
function validate(step, form) {
  const errs = {};
  if (step === 1) {
    if (!form.customerName.trim()) errs.customerName = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email required.';
    if (!/^[6-9]\d{9}$/.test(form.phone))
      errs.phone = 'Enter a valid 10-digit mobile.';
    if (!form.travelDate) errs.travelDate = 'Travel date is required.';
  }
  if (step === 2) {
    if (form.travellers.length === 0) errs.travellers = 'Add at least one traveller.';
    form.travellers.forEach((t, i) => {
      if (!t.firstName.trim()) errs[`t_fn_${i}`] = 'First name required.';
      if (!t.lastName.trim())  errs[`t_ln_${i}`] = 'Last name required.';
      if (!t.age || t.age < 1) errs[`t_age_${i}`] = 'Valid age required.';
    });
  }
  if (step === 4) {
    if (form.payMode === 'card') {
      if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, '')))
        errs.cardNumber = 'Enter a valid 16-digit card number.';
      if (!form.cardHolder.trim()) errs.cardHolder = 'Card holder name required.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry))
        errs.cardExpiry = 'Enter expiry as MM/YY.';
      if (!/^\d{3,4}$/.test(form.cardCvv)) errs.cardCvv = 'Enter valid CVV.';
    }
    if (form.payMode === 'upi') {
      if (!/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(form.upiId))
        errs.upiId = 'Enter a valid UPI ID (e.g. name@upi).';
    }
  }
  return errs;
}

/* ── Card number formatter ───────────────────────────────────── */
function formatCard(val) {
  return val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val) {
  const clean = val.replace(/\D/g, '').substring(0, 4);
  return clean.length > 2 ? clean.slice(0, 2) + '/' + clean.slice(2) : clean;
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Booking({ showToast }) {
  const navigate = useNavigate();
  const rawPkg   = sessionStorage.getItem('selectedPackage');
  const pkg      = rawPkg ? JSON.parse(rawPkg) : null;

  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState({
    customerName: '', email: '', phone: '', travelDate: '',
    specialReqs: '', selectedTier: pkg?.tiers?.[0]?.label || '',
    travellers: [{ firstName: '', lastName: '', age: '' }],
    // Payment fields
    payMode:    'card',
    cardNumber: '', cardHolder: '', cardExpiry: '', cardCvv: '',
    upiId:      '',
    showCvv:    false,
  });
  const [errors, setErrors]     = useState({});
  const [bookingRef, setRef]    = useState(null);
  const [submitting, setSubmit] = useState(false);
  const [modalOpen, setModal]   = useState(false);

  const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`;
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const setTraveller = (i, field, val) => setForm(f => {
    const t = [...f.travellers]; t[i] = { ...t[i], [field]: val }; return { ...f, travellers: t };
  });
  const addTraveller    = () => form.travellers.length < 6 && setForm(f => ({ ...f, travellers: [...f.travellers, { firstName: '', lastName: '', age: '' }] }));
  const removeTraveller = i  => setForm(f => ({ ...f, travellers: f.travellers.filter((_, idx) => idx !== i) }));
  const err = f => errors[f] ? <span className="error-msg">{errors[f]}</span> : null;

  const next = () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); showToast('Please fix the errors before continuing.', 'error'); return; }
    setErrors({});
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    const errs = validate(4, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); showToast('Please fix the payment details.', 'error'); return; }
    setSubmit(true);
    try {
      const { payMode, cardNumber, cardHolder, cardExpiry, cardCvv, upiId, showCvv, ...bookingData } = form;
      const payload = { ...bookingData, packageId: pkg?._id, paymentMethod: payMode };
      const res = await api.post('/bookings', payload);
      setRef(res.data.bookingRef);
      setModal(true);
      sessionStorage.removeItem('selectedPackage');
    } catch {
      showToast('Booking failed. Please try again.', 'error');
    } finally {
      setSubmit(false);
    }
  };

  const stepLabels = ['Contact Info', 'Travellers', 'Review', 'Payment'];

  // Detect card type from number
  const getCardType = (num) => {
    const n = num.replace(/\s/g, '');
    if (/^4/.test(n))         return { label: 'Visa',       icon: 'fa-cc-visa',       color: '#1a1f71' };
    if (/^5[1-5]/.test(n))   return { label: 'Mastercard', icon: 'fa-cc-mastercard',  color: '#eb001b' };
    if (/^3[47]/.test(n))    return { label: 'Amex',       icon: 'fa-cc-amex',        color: '#006fcf' };
    if (/^6/.test(n))         return { label: 'RuPay',      icon: 'fa-credit-card',    color: '#2c8e3e' };
    return null;
  };
  const cardType = getCardType(form.cardNumber);

  return (
    <>
      <div className="page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
          <span>Booking</span>
        </nav>
        <h1>Book Your Package</h1>
      </div>

      <div className="booking-layout">
        {/* ── Left: Form ──────────────────────────── */}
        <div className="booking-form-card">
          {/* Step indicator */}
          <div className="step-indicator">
            {stepLabels.map((label, i) => (
              <div key={i} className="step-item">
                <div className={`step${step === i + 1 ? ' active' : ''}${step > i + 1 ? ' done' : ''}`}>
                  {step > i + 1 ? <i className="fas fa-check" style={{ fontSize: '0.7rem' }}></i> : i + 1}
                </div>
                <span className="step-label">{label}</span>
                {i < stepLabels.length - 1 && <div className={`step-line${step > i + 1 ? ' done' : ''}`}></div>}
              </div>
            ))}
          </div>

          {/* ── Step 1: Contact & Trip ─── */}
          {step === 1 && (
            <div className="step-panel" data-step="1">
              <h3>Contact & Trip Details</h3>
              <div className="form-grid">
                <div className={`form-group${errors.customerName ? ' has-error' : ''}`}>
                  <label>Full Name</label>
                  <input type="text" value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Your full name" required />
                  {err('customerName')}
                </div>
                <div className={`form-group${errors.email ? ' has-error' : ''}`}>
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required />
                  {err('email')}
                </div>
                <div className={`form-group${errors.phone ? ' has-error' : ''}`}>
                  <label>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile" required />
                  {err('phone')}
                </div>
                <div className={`form-group${errors.travelDate ? ' has-error' : ''}`}>
                  <label>Travel Date</label>
                  <input type="date" value={form.travelDate} onChange={e => set('travelDate', e.target.value)} required />
                  {err('travelDate')}
                </div>
              </div>
              {pkg?.tiers?.length > 0 && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Select Tier</label>
                  <select value={form.selectedTier} onChange={e => set('selectedTier', e.target.value)}>
                    {pkg.tiers.map((t, i) => <option key={i} value={t.label}>{t.label} — {fmt(t.price)}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group full-width">
                <label>Special Requests</label>
                <textarea value={form.specialReqs} onChange={e => set('specialReqs', e.target.value)} placeholder="Any special requirements…" rows={3}></textarea>
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={next}>Next <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* ── Step 2: Travellers ─── */}
          {step === 2 && (
            <div className="step-panel" data-step="2">
              <h3>Traveller Details</h3>
              {errors.travellers && <div className="error-msg" style={{ marginBottom: '1rem' }}>{errors.travellers}</div>}
              <div id="traveller-list">
                {form.travellers.map((t, i) => (
                  <div key={i} className="traveller-row form-grid">
                    <div className={`form-group${errors[`t_fn_${i}`] ? ' has-error' : ''}`}>
                      <label>First Name {i > 0 && `(Traveller ${i + 1})`}</label>
                      <input type="text" value={t.firstName} onChange={e => setTraveller(i, 'firstName', e.target.value)} placeholder="First name" required />
                      {err(`t_fn_${i}`)}
                    </div>
                    <div className={`form-group${errors[`t_ln_${i}`] ? ' has-error' : ''}`}>
                      <label>Last Name</label>
                      <input type="text" value={t.lastName} onChange={e => setTraveller(i, 'lastName', e.target.value)} placeholder="Last name" required />
                      {err(`t_ln_${i}`)}
                    </div>
                    <div className={`form-group${errors[`t_age_${i}`] ? ' has-error' : ''}`}>
                      <label>Age</label>
                      <input type="number" value={t.age} onChange={e => setTraveller(i, 'age', e.target.value)} placeholder="Age" min="1" max="100" required />
                      {err(`t_age_${i}`)}
                    </div>
                    {i > 0 && (
                      <div className="form-group" style={{ alignSelf: 'end', paddingBottom: '4px' }}>
                        <button className="btn-outline" type="button" onClick={() => removeTraveller(i)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button id="add-traveller" className="btn-outline" type="button" onClick={addTraveller} disabled={form.travellers.length >= 6}>
                <i className="fas fa-plus"></i> Add Traveller
              </button>
              <div className="form-actions">
                <button className="btn-outline" onClick={back}><i className="fas fa-arrow-left"></i> Back</button>
                <button className="btn-primary" onClick={next}>Next <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ─── */}
          {step === 3 && (
            <div className="step-panel" data-step="3">
              <h3>Review & Confirm</h3>
              <div className="review-section">
                <div className="review-row"><span>Name</span><strong>{form.customerName}</strong></div>
                <div className="review-row"><span>Email</span><strong>{form.email}</strong></div>
                <div className="review-row"><span>Phone</span><strong>{form.phone}</strong></div>
                <div className="review-row"><span>Travel Date</span><strong>{form.travelDate}</strong></div>
                <div className="review-row"><span>Selected Tier</span><strong>{form.selectedTier}</strong></div>
                <div className="review-row"><span>Travellers</span><strong>{form.travellers.length}</strong></div>
                {pkg && <div className="review-row"><span>Package Total</span><strong style={{ color: '#111', fontWeight: 800 }}>{fmt(pkg.totalPrice)}</strong></div>}
                {form.specialReqs && <div className="review-row"><span>Special Requests</span><strong>{form.specialReqs}</strong></div>}
              </div>
              <div className="form-actions">
                <button className="btn-outline" onClick={back}><i className="fas fa-arrow-left"></i> Back</button>
                <button className="btn-primary" onClick={next}><i className="fas fa-lock"></i> Proceed to Payment</button>
              </div>
            </div>
          )}

          {/* ── Step 4: Payment ─── */}
          {step === 4 && (
            <div className="step-panel" data-step="4">
              <h3><i className="fas fa-lock" style={{ marginRight: '8px', color: '#2d7a4f' }}></i>Secure Payment</h3>

              {/* Payment mode tabs */}
              <div className="pay-tabs">
                {[
                  { id: 'card', icon: 'fa-credit-card', label: 'Card' },
                  { id: 'upi',  icon: 'fa-mobile-alt',  label: 'UPI'  },
                  { id: 'net',  icon: 'fa-university',  label: 'Net Banking' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`pay-tab${form.payMode === tab.id ? ' active' : ''}`}
                    onClick={() => set('payMode', tab.id)}
                  >
                    <i className={`fas ${tab.icon}`}></i> {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Card Payment ── */}
              {form.payMode === 'card' && (
                <div className="pay-card-form">
                  {/* Visual card preview */}
                  <div className="card-preview">
                    <div className="card-preview-top">
                      <i className="fas fa-sim-card card-chip"></i>
                      {cardType && <i className={`fab ${cardType.icon} card-network`} style={{ color: cardType.color }}></i>}
                    </div>
                    <div className="card-preview-number">
                      {form.cardNumber ? form.cardNumber.padEnd(19, '·') : '···· ···· ···· ····'}
                    </div>
                    <div className="card-preview-bottom">
                      <div>
                        <div className="card-preview-label">Card Holder</div>
                        <div className="card-preview-value">{form.cardHolder || 'YOUR NAME'}</div>
                      </div>
                      <div>
                        <div className="card-preview-label">Expires</div>
                        <div className="card-preview-value">{form.cardExpiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className={`form-group full-width${errors.cardNumber ? ' has-error' : ''}`}>
                      <label>Card Number</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text" inputMode="numeric" maxLength={19}
                          value={form.cardNumber}
                          onChange={e => set('cardNumber', formatCard(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                        />
                        {cardType && (
                          <i className={`fab ${cardType.icon}`} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem', color: cardType.color }}></i>
                        )}
                      </div>
                      {err('cardNumber')}
                    </div>
                    <div className={`form-group full-width${errors.cardHolder ? ' has-error' : ''}`}>
                      <label>Name on Card</label>
                      <input type="text" value={form.cardHolder} onChange={e => set('cardHolder', e.target.value.toUpperCase())} placeholder="AS ON YOUR CARD" />
                      {err('cardHolder')}
                    </div>
                    <div className={`form-group${errors.cardExpiry ? ' has-error' : ''}`}>
                      <label>Expiry</label>
                      <input type="text" inputMode="numeric" maxLength={5} value={form.cardExpiry} onChange={e => set('cardExpiry', formatExpiry(e.target.value))} placeholder="MM/YY" />
                      {err('cardExpiry')}
                    </div>
                    <div className={`form-group${errors.cardCvv ? ' has-error' : ''}`}>
                      <label>CVV <i className="fas fa-question-circle" style={{ color: 'var(--text-muted)', cursor: 'help' }} title="3-digit code on the back of your card"></i></label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={form.showCvv ? 'text' : 'password'} inputMode="numeric" maxLength={4}
                          value={form.cardCvv}
                          onChange={e => set('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="CVV"
                        />
                        <button
                          type="button" onClick={() => set('showCvv', !form.showCvv)}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <i className={`fas fa-eye${form.showCvv ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                      {err('cardCvv')}
                    </div>
                  </div>
                </div>
              )}

              {/* ── UPI Payment ── */}
              {form.payMode === 'upi' && (
                <div className="pay-upi-form">
                  <div className="upi-logos">
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <div key={app} className="upi-app-badge">{app}</div>
                    ))}
                  </div>
                  <div className={`form-group${errors.upiId ? ' has-error' : ''}`} style={{ maxWidth: '400px' }}>
                    <label>UPI ID</label>
                    <input type="text" value={form.upiId} onChange={e => set('upiId', e.target.value)} placeholder="yourname@upi or @okaxis" />
                    {err('upiId')}
                  </div>
                  <p className="pay-note"><i className="fas fa-info-circle"></i> You will receive a payment request on your UPI app after confirming.</p>
                </div>
              )}

              {/* ── Net Banking ── */}
              {form.payMode === 'net' && (
                <div className="pay-net-form">
                  <div className="net-bank-grid">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank'].map(bank => (
                      <button key={bank} className="net-bank-btn">{bank}</button>
                    ))}
                  </div>
                  <p className="pay-note"><i className="fas fa-info-circle"></i> You will be redirected to your bank's secure payment portal.</p>
                </div>
              )}

              {/* Security note */}
              <div className="pay-secure-note">
                <i className="fas fa-shield-alt"></i>
                <span>Your payment is 100% secure. We use 256-bit SSL encryption.</span>
              </div>

              <div className="form-actions">
                <button className="btn-outline" onClick={back}><i className="fas fa-arrow-left"></i> Back</button>
                <button id="submit-booking" className="btn-pay" onClick={submit} disabled={submitting}>
                  {submitting
                    ? <><i className="fas fa-spinner fa-spin"></i> Processing…</>
                    : <><i className="fas fa-lock"></i> Pay {pkg ? fmt(pkg.totalPrice) : ''}</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Summary ──────────────────────── */}
        {pkg && (
          <div className="booking-summary-card">
            <h3>Booking Summary</h3>
            <div className="sum-row"><span>Destination</span><strong id="sum-destination">{pkg.destination}</strong></div>
            <div className="sum-row"><span>Rating</span><strong id="sum-stars">{'★'.repeat(pkg.stars || 0)}</strong></div>
            <div className="sum-row"><span>Type</span><strong id="sum-type">{pkg.type === 'international' ? 'International' : 'Indian'}</strong></div>
            <div className="sum-row"><span>Airline</span><strong>{pkg.airline || '—'}</strong></div>
            <div className="sum-row"><span>Base Price</span><strong id="sum-price">{`₹${(pkg.price || 0).toLocaleString('en-IN')}`}</strong></div>
            <div className="sum-divider"></div>
            <div className="sum-row sum-total"><span>Package Total</span><strong id="sum-total">{`₹${(pkg.totalPrice || 0).toLocaleString('en-IN')}`}</strong></div>
            {step === 4 && (
              <div className="pay-summary-badge">
                <i className="fas fa-lock"></i> Secure Checkout
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Confirmation Modal ─────────────────────────────── */}
      {modalOpen && (
        <div className="modal open" id="booking-modal" role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-card">
            <button className="modal-close" id="modal-close-btn" onClick={() => setModal(false)} aria-label="Close"><i className="fas fa-times"></i></button>
            <div className="modal-icon"><i className="fas fa-check-circle"></i></div>
            <h2>Payment Successful!</h2>
            <p>Your booking is confirmed. Reference:</p>
            <div className="booking-ref" id="booking-ref">{bookingRef}</div>
            <p className="modal-sub">A confirmation will be sent to <strong>{form.email}</strong></p>
            <button id="modal-done-btn" className="btn-primary" onClick={() => { setModal(false); navigate('/'); }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
