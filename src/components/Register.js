import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      onLogin(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth:'400px'}}>
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
          <div className="text-center mt-2">
            <small>
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
