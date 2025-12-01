import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTable.css';

const AdminUsers = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', joined: '2024-01-01', bookings: 5 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', joined: '2024-01-02', bookings: 3 },
    { id: 3, name: 'Michael Johnson', email: 'michael@example.com', role: 'Customer', joined: '2024-01-03', bookings: 8 },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Users Management</h1>
            <p>Manage customer accounts</p>
          </div>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <input type="text" placeholder="Search users..." className="search-input" />
          </div>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Total Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge badge-info">{user.role}</span></td>
                  <td>{user.joined}</td>
                  <td>{user.bookings}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title="Edit">✏️</button>
                      <button className="action-btn delete" title="Delete">🗑️</button>
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

export default AdminUsers;
