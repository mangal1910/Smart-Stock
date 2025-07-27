import React, { useState } from 'react';
import axios from 'axios';

function ItemForm({ token, item, onFinish }) {
  const [name, setName] = useState(item?.name || '');
  const [brand, setBrand] = useState(item?.brand || '');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [price, setPrice] = useState(item?.price || 0);
  const [mfgDate, setMfgDate] = useState(item?.mfgDate ? item.mfgDate.slice(0,10) : '');
  const [expiryDate, setExpiryDate] = useState(item?.expiryDate ? item.expiryDate.slice(0,10) : '');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if(item) {
        await axios.put(`http://localhost:5000/api/items/${item._id}`,
          { name, brand, quantity, price, mfgDate, expiryDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post('http://localhost:5000/api/items',
          { name, brand, quantity, price, mfgDate, expiryDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onFinish();
    } catch (err) {
      setError('Failed to save item');
    }
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{item ? "Edit Item" : "Add Item"}</h5>
              <button type="button" className="btn-close" onClick={onFinish}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <input value={name} onChange={e=>setName(e.target.value)} className="form-control" placeholder="Name" required/>
              </div>
              <div className="mb-3">
                <input value={brand} onChange={e=>setBrand(e.target.value)} className="form-control" placeholder="Brand" />
              </div>
              <div className="mb-3">
                <input type="number" value={quantity} min={1} onChange={e=>setQuantity(e.target.value)} className="form-control" placeholder="Quantity" />
              </div>
              <div className="mb-3">
                <input type="number" value={price} min={0} onChange={e=>setPrice(e.target.value)} className="form-control" placeholder="Price" />
              </div>
              <div className="mb-3">
                <label>Mfg Date: <input type="date" value={mfgDate} onChange={e=>setMfgDate(e.target.value)} className="form-control d-inline w-auto"/></label>
              </div>
              <div className="mb-3">
                <label>Expiry: <input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="form-control d-inline w-auto" required /></label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">{item ? "Save Changes" : "Add Item"}</button>
              <button onClick={onFinish} type="button" className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ItemForm;
