import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

export default function SellerDashboard() {
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/api/shops/my').then(res => {
      setShop(res.data);
      if (res.data?.id) {
        API.get(`/api/products/shop/${res.data.id}`).then(r => setProducts(r.data));
      }
    }).catch(() => {});
    API.get('/api/orders/seller').then(res => setOrders(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {!shop ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800">You haven't created a shop yet.</p>
          <Link to="/seller/shop" className="text-indigo-600 hover:underline font-medium">Create your shop →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Shop</h3>
            <p className="text-2xl font-bold">{shop.name}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Products</h3>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/seller/shop" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">Manage Shop</h3>
          <p className="text-gray-500 mt-2">Edit shop details</p>
        </Link>
        <Link to="/seller/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">Manage Products</h3>
          <p className="text-gray-500 mt-2">Add or edit products</p>
        </Link>
        <Link to="/seller/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-indigo-600">View Orders</h3>
          <p className="text-gray-500 mt-2">Manage customer orders</p>
        </Link>
      </div>
    </div>
  );
}
