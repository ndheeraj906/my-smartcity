import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { BASE_URL } from '../../api/axios';
export default function Cart() {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get('/api/cart');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await API.put(`/api/cart/${itemId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await API.delete(`/api/cart/${itemId}`);
    fetchCart();
  };

  const total = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  const placeOrder = async () => {
    if (!address.trim()) {
      setMessage('Please enter a shipping address');
      return;
    }
    try {
      await API.post('/api/orders', { shippingAddress: address });
      setMessage('Order placed successfully!');
      setItems([]);
      setTimeout(() => navigate('/customer/orders'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to place order');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {message && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>}

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  {item.productImage ? (
                    <img src={`${BASE_URL}/uploads/${item.productImage}`} alt=""
                      className="w-full h-full object-cover rounded" />
                  ) : <span className="text-2xl">📦</span>}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-indigo-600 font-bold">${item.productPrice?.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300">+</button>
                </div>
                <span className="font-bold w-24 text-right">${(item.productPrice * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-xl">×</button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <textarea placeholder="Shipping Address" value={address} onChange={e => setAddress(e.target.value)}
              className="w-full border rounded p-2 mt-4" rows={3} />
            <button onClick={placeOrder}
              className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700">
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
