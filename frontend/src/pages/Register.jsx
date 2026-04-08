import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', fullName: '', phone: '', role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/api/auth/register', form);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.username || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}
              className="w-full border rounded-lg px-3 py-2">
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required minLength={6} />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
