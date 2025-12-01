import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTable.css';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Configure system settings and preferences</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>General Settings</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Site Name</label>
                <input type="text" defaultValue="Somansa Rental System" className="search-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Email</label>
                <input type="email" defaultValue="info@somansa.com" className="search-input" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
                <input type="tel" defaultValue="+62 21 1234 5678" className="search-input" />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Payment Settings</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Enable Credit Card Payments</span>
                </label>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Enable Bank Transfer</span>
                </label>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" />
                  <span>Enable PayPal</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Booking Settings</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Minimum Booking Days</label>
                <input type="number" defaultValue="1" className="search-input" style={{ maxWidth: '200px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cancellation Policy (hours before check-in)</label>
                <input type="number" defaultValue="24" className="search-input" style={{ maxWidth: '200px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary">Save Changes</button>
            <button className="btn btn-secondary">Reset</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
