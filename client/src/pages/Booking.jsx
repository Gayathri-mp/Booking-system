import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TOTAL_STEPS = 3;

function validate(step, form) {
  const errs = {};
  if (step === 1) {
    if (!form.customerName.trim()) errs.customerName = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required.';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile.';
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
  return errs;
}

export default function Booking({ showToast }) {
  const navigate  = useNavigate();
  const rawPkg    = sessionStorage.getItem('selectedPackage');
  const pkg       = rawPkg ? JSON.parse(rawPkg) : null;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerName: '', email: '', phone: '', travelDate: '',
    specialReqs: '', selectedTier: pkg?.tiers?.[0]?.label || '',
    travellers: [{ firstName: '', lastName: '', age: '' }],
  });
  const [errors, setErrors]     = useState({});
  const [bookingRef, setRef]    = useState(null);
  const [submitting, setSubmit] = useState(false);
  const [modalOpen, setModal]   = useState(false);

  const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const setTraveller = (i, field, val) => setForm(f => {
    const t = [...f.travellers];
    t[i] = { ...t[i], [field]: val };
    return { ...f, travellers: t };
  });

  const addTraveller    = () => form.travellers.length < 6 && setForm(f => ({ ...f, travellers: [...f.travellers, { firstName: '', lastName: '', age: '' }] }));
  const removeTraveller = i  => setForm(f => ({ ...f, travellers: f.travellers.filter((_, idx) => idx !== i) }));

  const next = () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); showToast('Please fix the errors before continuing.', 'error'); return; }
    setErrors({});
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); showToast('Please fix the errors.', 'error'); return; }
    setSubmit(true);
    try {
      const payload = { ...form, packageId: pkg?._id };
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

  const err = (f) => errors[f] ? <span className="error-msg">{errors[f]}</span> : null;

  const stepLabels = ['Traveller Info', 'Travellers', 'Review & Pay'];

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
        {/* Left: Form */}
        <div className="booking-form-card">
          {/* Step indicator */}
          <div className="step-indicator">
            {stepLabels.map((label, i) => (
              <div key={i} className="step-item">
                <div className={`step${step === i + 1 ? ' active' : ''}${step > i + 1 ? ' done' : ''}`}>{i + 1}</div>
                <span className="step-label">{label}</span>
                {i < stepLabels.length - 1 && <div className={`step-line${step > i + 1 ? ' done' : ''}`}></div>}
              </div>
            ))}
          </div>

          {/* Step 1 */}
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
                <div className="form-group">
                  <label>Select Tier</label>
                  <select value={form.selectedTier} onChange={e => set('selectedTier', e.target.value)}>
                    {pkg.tiers.map((t, i) => (
                      <option key={i} value={t.label}>{t.label} — {fmt(t.price)}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Special Requests</label>
                <textarea value={form.specialReqs} onChange={e => set('specialReqs', e.target.value)} placeholder="Any special requirements…" rows={3}></textarea>
              </div>
              <div className="form-actions">
                <button className="btn-primary btn-next" onClick={next}>Next <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* Step 2 */}
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
              <button id="add-traveller" className="btn-outline" type="button" onClick={addTraveller}
                disabled={form.travellers.length >= 6}>
                <i className="fas fa-plus"></i> Add Traveller
              </button>
              <div className="form-actions">
                <button className="btn-outline btn-prev" onClick={back}><i className="fas fa-arrow-left"></i> Back</button>
                <button className="btn-primary btn-next" onClick={next}>Next <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* Step 3 */}
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
                {form.specialReqs && <div className="review-row"><span>Special Requests</span><strong>{form.specialReqs}</strong></div>}
              </div>
              <div className="form-actions">
                <button className="btn-outline btn-prev" onClick={back}><i className="fas fa-arrow-left"></i> Back</button>
                <button id="submit-booking" className="btn-primary" onClick={submit} disabled={submitting}>
                  {submitting ? <><i className="fas fa-spinner fa-spin"></i> Booking…</> : <><i className="fas fa-check"></i> Confirm Booking</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        {pkg && (
          <div className="booking-summary-card">
            <h3>Booking Summary</h3>
            <div className="sum-row"><span>Destination</span><strong id="sum-destination">{pkg.destination}</strong></div>
            <div className="sum-row"><span>Rating</span><strong id="sum-stars">{'★'.repeat(pkg.stars || 0)}</strong></div>
            <div className="sum-row"><span>Type</span><strong id="sum-type">{pkg.type === 'international' ? 'International' : 'Indian'}</strong></div>
            <div className="sum-row"><span>Base Price</span><strong id="sum-price">{`₹${(pkg.price || 0).toLocaleString('en-IN')}`}</strong></div>
            <div className="sum-divider"></div>
            <div className="sum-row sum-total"><span>Package Total</span><strong id="sum-total">{`₹${(pkg.totalPrice || 0).toLocaleString('en-IN')}`}</strong></div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="modal open" id="booking-modal" role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-card">
            <button className="modal-close" id="modal-close-btn" onClick={() => setModal(false)} aria-label="Close"><i className="fas fa-times"></i></button>
            <div className="modal-icon"><i className="fas fa-check-circle"></i></div>
            <h2>Booking Confirmed!</h2>
            <p>Your booking reference is:</p>
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
