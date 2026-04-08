import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/api/orders/my').then(res => setOrders(res.data)).catch(() => {});
  }, []);

  const simulatePayment = async (orderId) => {
    await API.post(`/api/orders/${orderId}/pay`);
    API.get('/api/orders/my').then(res => setOrders(res.data));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
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
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-sm ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{order.status}</span>
                  <span className={`ml-2 px-3 py-1 rounded text-sm ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>{order.paymentStatus}</span>
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
              <div className="border-t pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-bold">Total: ${order.totalAmount?.toFixed(2)}</span>
                {order.paymentStatus === 'PENDING' && (
                  <button onClick={() => simulatePayment(order.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Pay Now (Simulated)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
