import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    API.get('/api/users/me').then(res => setProfile(res.data)).catch(() => {});
    API.get('/api/orders/my').then(res => setRecentOrders(res.data.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {profile?.fullName || user.username}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/customer/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">Browse Products</h3>
          <p className="text-gray-500 mt-2">Discover amazing products</p>
        </Link>
        <Link to="/customer/cart" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">My Cart</h3>
          <p className="text-gray-500 mt-2">View your shopping cart</p>
        </Link>
        <Link to="/customer/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">My Orders</h3>
          <p className="text-gray-500 mt-2">Track your orders</p>
        </Link>
      </div>

      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="font-medium">Order #{order.id}</span>
                  <span className={`ml-3 px-2 py-1 rounded text-xs ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{order.status}</span>
                </div>
                <span className="font-semibold">${order.totalAmount?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
