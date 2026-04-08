import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/api/admin/orders').then(res => setOrders(res.data)).catch(() => {});
  }, []);

  const updateStatus = async (orderId, status) => {
    await API.put(`/api/orders/${orderId}/status`, { status });
    API.get('/api/admin/orders').then(res => setOrders(res.data));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-sm">{order.id}</td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 text-sm font-medium">${order.totalAmount?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm">
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>{order.paymentStatus}</span>
                </td>
                <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{order.items?.length || 0} items</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
