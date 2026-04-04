import { useEffect, useState } from 'react';
import api from '../api';

export default function Leads({ showToast }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/contact');
        setLeads(res.data);
      } catch (err) {
        showToast('Failed to fetch leads.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner"></div><p>Fetching your business inquiries...</p></div>;

  return (
    <>
      <div className="page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
          <span>Leads Management</span>
        </nav>
        <h1>Leads & Inquiries</h1>
        <p>Manage potential customers and their recent inquiries.</p>
      </div>

      <div className="table-card" role="region" aria-label="Leads table">
        {leads.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fas fa-user-tag" style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }}></i>
            <p>No inquiries received yet. They will appear here when customers contact you.</p>
          </div>
        ) : (
          <table aria-label="Customer leads">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email / Phone</th>
                <th>Subject</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id}>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="font-semibold">{lead.name}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{lead.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.phone || '—'}</div>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.subject || 'General Inquiry'}
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {lead.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
