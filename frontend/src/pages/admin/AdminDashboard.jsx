import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    API.get('/api/admin/analytics').then(res => setAnalytics(res.data)).catch(() => {});
  }, []);

  if (!analytics) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalCustomers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Sellers</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.totalSellers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics.totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600">${analytics.totalRevenue?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{analytics.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600">{analytics.pendingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Delivered Orders</h3>
          <p className="text-2xl font-bold text-green-600">{analytics.deliveredOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">Manage Users</h3>
          <p className="text-gray-500 mt-2">View and manage all users</p>
        </Link>
        <Link to="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">Monitor Products</h3>
          <p className="text-gray-500 mt-2">View and remove products</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">Monitor Orders</h3>
          <p className="text-gray-500 mt-2">View all orders</p>
        </Link>
      </div>
    </div>
  );
}
