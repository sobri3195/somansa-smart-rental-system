import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTable.css';

const AdminReviews = () => {
  const reviews = [
    { id: 1, property: 'Apartment Central Jakarta', user: 'John Doe', rating: 5, comment: 'Excellent property!', status: 'approved', date: '2024-01-10' },
    { id: 2, property: 'Villa Bali Paradise', user: 'Jane Smith', rating: 4, comment: 'Great experience', status: 'pending', date: '2024-01-11' },
  ];

  const getStatusBadge = (status) => {
    const badges = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };
    return badges[status] || 'badge-default';
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Reviews Management</h1>
            <p>Moderate and manage property reviews</p>
          </div>
        </div>

        <div className="table-controls">
          <div className="filter-tabs">
            <button className="filter-tab active">All</button>
            <button className="filter-tab">Pending</button>
            <button className="filter-tab">Approved</button>
          </div>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.property}</td>
                  <td>{review.user}</td>
                  <td><span className="rating">⭐ {review.rating}</span></td>
                  <td>{review.comment}</td>
                  <td>{review.date}</td>
                  <td><span className={`badge ${getStatusBadge(review.status)}`}>{review.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title="Approve">✅</button>
                      <button className="action-btn delete" title="Reject">❌</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
