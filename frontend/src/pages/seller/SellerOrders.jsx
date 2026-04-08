import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/api/orders/seller').then(res => setOrders(res.data)).catch(() => {});
  }, []);

  const updateStatus = async (orderId, status) => {
    await API.put(`/api/orders/${orderId}/status`, { status });
    API.get('/api/orders/seller').then(res => setOrders(res.data));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm">
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              {order.items && (
                <div className="border-t pt-3 space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.productName} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-bold">Total: ${order.totalAmount?.toFixed(2)}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>{order.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
