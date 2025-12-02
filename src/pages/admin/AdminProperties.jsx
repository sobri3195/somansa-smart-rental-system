import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTable.css';

const AdminProperties = () => {
  const [properties] = useState([
    {
      id: 1,
      name: 'Apartment Central Jakarta',
      category: 'Apartment',
      city: 'Jakarta',
      units: 12,
      basePrice: 1500000,
      status: 'active',
      rating: 4.5,
      views: 1234,
    },
    {
      id: 2,
      name: 'Villa Bali Paradise',
      category: 'Villa',
      city: 'Bali',
      units: 5,
      basePrice: 5000000,
      status: 'active',
      rating: 4.8,
      views: 2456,
    },
    {
      id: 3,
      name: 'Studio Bandung',
      category: 'Studio',
      city: 'Bandung',
      units: 20,
      basePrice: 750000,
      status: 'active',
      rating: 4.2,
      views: 876,
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-danger',
      maintenance: 'badge-warning',
    };
    return badges[status] || 'badge-default';
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Properties Management</h1>
            <p>Manage all property listings</p>
          </div>
          <Link to="/adminsuper/properties/new" className="btn btn-primary">
            + Add New Property
          </Link>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({properties.length})
            </button>
            <button
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({properties.filter((p) => p.status === 'active').length})
            </button>
            <button
              className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive ({properties.filter((p) => p.status === 'inactive').length})
            </button>
          </div>

          <div className="view-options">
            <button className="view-btn active">📋</button>
            <button className="view-btn">🎴</button>
          </div>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Property</th>
                <th>Category</th>
                <th>City</th>
                <th>Units</th>
                <th>Base Price</th>
                <th>Rating</th>
                <th>Views</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="property-cell">
                      <div className="property-info">
                        <Link
                          to={`/adminsuper/properties/${property.id}`}
                          className="property-name"
                        >
                          {property.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>{property.category}</td>
                  <td>{property.city}</td>
                  <td>{property.units}</td>
                  <td>{formatCurrency(property.basePrice)}</td>
                  <td>
                    <span className="rating">⭐ {property.rating}</span>
                  </td>
                  <td>{property.views.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/adminsuper/properties/${property.id}/edit`}
                        className="action-btn edit"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button className="action-btn delete" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div className="pagination-info">Showing 1 to {properties.length} of {properties.length} entries</div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              Previous
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
