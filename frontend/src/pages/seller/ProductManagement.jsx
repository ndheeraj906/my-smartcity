import { useEffect, useState } from 'react';
import API, { BASE_URL } from '../../api/axios';
export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/api/shops/my').then(res => {
      setShop(res.data);
      if (res.data?.id) fetchProducts(res.data.id);
    }).catch(() => {});
  }, []);

  const fetchProducts = (shopId) => {
    API.get(`/api/products/shop/${shopId}`).then(res => setProducts(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editing) {
        await API.put(`/api/products/${editing}`, data);
        setMessage('Product updated!');
      } else {
        await API.post('/api/products', data);
        setMessage('Product created!');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', stock: '', category: '' });
      if (shop?.id) fetchProducts(shop.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || ''
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await API.delete(`/api/products/${id}`);
    if (shop?.id) fetchProducts(shop.id);
  };

  const handleImageUpload = async (productId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await API.post(`/api/products/${productId}/image`, formData);
    if (shop?.id) fetchProducts(shop.id);
  };

  if (!shop) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">Please create a shop first before adding products.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={() => {
          setShowForm(!showForm);
          setEditing(null);
          setForm({ name: '', description: '', price: '', stock: '', category: '' });
        }} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border rounded px-3 py-2" rows={3} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={`${BASE_URL}/uploads/${product.image}`} alt=""
                  className="w-full h-full object-cover" />
              ) : <span className="text-3xl">📦</span>}
            </div>
            <h3 className="font-semibold">{product.name}</h3>
            <div className="flex justify-between mt-1">
              <span className="text-indigo-600 font-bold">${product.price?.toFixed(2)}</span>
              <span className="text-sm text-gray-500">Stock: {product.stock}</span>
            </div>
            {product.category && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(product)}
                className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(product.id)}
                className="flex-1 bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600">Delete</button>
              <label className="flex-1 bg-gray-500 text-white py-1 rounded text-sm hover:bg-gray-600 text-center cursor-pointer">
                Image
                <input type="file" accept="image/*" onChange={e => handleImageUpload(product.id, e)} className="hidden" />
              </label>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No products yet. Add your first product!</p>
      )}
    </div>
  );
}
