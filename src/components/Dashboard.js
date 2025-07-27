import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemForm from './ItemForm';

function Dashboard({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/items', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data);
    setFilteredItems(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  // Handles search filter on button click
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = items.filter(item =>
      (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
      (item.brand && item.brand.toLowerCase().includes(lowerSearch))
    );
    setFilteredItems(filtered);
  };

  // Optional: clear search and show all
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredItems(items);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this item?')) {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    }
  };

  const handleEdit = item => {
    setEditing(item);
    setShowForm(true);
  };

  const handleFormFinish = () => {
    setEditing(null);
    setShowForm(false);
    fetchItems();
  };

  const getRowClass = (status) => {
    if (status === 'red') return 'table-danger';
    if (status === 'yellow') return 'table-warning';
    return 'table-success';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventory Dashboard</h2>
        <button onClick={onLogout} className="btn btn-outline-secondary">Logout</button>
      </div>
      <div className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Brand"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="btn btn-primary">Search</button>
        <button onClick={clearSearch} className="btn btn-secondary">Clear</button>
      </div>
      <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn btn-primary mb-3">Add Item</button>
      {showForm && <ItemForm token={token} item={editing} onFinish={handleFormFinish} />}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th><th>Brand</th><th>Qty</th><th>Price</th>
              <th>Mfg Date</th><th>Expiry Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <tr key={item._id} className={getRowClass(item.expiryStatus)}>
              <td>{item.name}</td>
              <td>{item.brand}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.mfgDate && new Date(item.mfgDate).toLocaleDateString()}</td>
              <td>{item.expiryDate && new Date(item.expiryDate).toLocaleDateString()}</td>
              <td style={{fontWeight: 'bold'}}>
                {item.expiryStatus === 'red' ? 'Expired'
                 : item.expiryStatus === 'yellow' ? 'Expiring Soon'
                 : 'OK'}
              </td>
              <td>
                <button onClick={() => handleEdit(item)} className="btn btn-sm btn-info me-2">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="text-center">No items found</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <span className="badge bg-success me-2">Safe</span>
        <span className="badge bg-warning text-dark me-2">Expiring Soon</span>
        <span className="badge bg-danger">Expired</span>
      </div>
    </div>
  );
}

export default Dashboard;
