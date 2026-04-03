import { useState } from 'react';
import api from '../api';

export default function Contact({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmit] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmit(true);
    try {
      await api.post('/contact', form);
      showToast('Message sent! We will contact you shortly.', 'success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSubmit(false);
    }
  };

  const err = f => errors[f] ? <span className="error-msg">{errors[f]}</span> : null;

  return (
    <>
      <div className="page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
          <span>Customer Support</span>
        </nav>
        <h1>Contact &amp; Support</h1>
        <p>We're here to help. Send us a message and we'll get back to you shortly.</p>
      </div>

      <div className="contact-layout">
        {/* Info Cards */}
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon"><i className="fas fa-phone-alt"></i></div>
            <h4>Phone</h4>
            <p>+91 98765 43210</p>
            <p>Mon–Sat, 9am–7pm IST</p>
          </div>
          <div className="info-card">
            <div className="info-icon"><i className="fas fa-envelope"></i></div>
            <h4>Email</h4>
            <p>support@holidaybook.in</p>
            <p>Response within 24 hours</p>
          </div>
          <div className="info-card">
            <div className="info-icon"><i className="fas fa-map-marker-alt"></i></div>
            <h4>Office</h4>
            <p>12, Travel Hub, Banjara Hills</p>
            <p>Hyderabad, Telangana 500034</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h3>Send a Message</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`form-group${errors.name ? ' has-error' : ''}`}>
                <label htmlFor="contact-name">Full Name</label>
                <input id="contact-name" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
                {err('name')}
              </div>
              <div className={`form-group${errors.email ? ' has-error' : ''}`}>
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required />
                {err('email')}
              </div>
              <div className="form-group">
                <label htmlFor="contact-phone">Phone <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input id="contact-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" type="text" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="How can we help?" />
              </div>
              <div className={`form-group full-width${errors.message ? ' has-error' : ''}`}>
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Describe your issue or inquiry…" rows={5} required></textarea>
                {err('message')}
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? <><i className="fas fa-spinner fa-spin"></i> Sending…</>
                : <><i className="fas fa-paper-plane"></i> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
