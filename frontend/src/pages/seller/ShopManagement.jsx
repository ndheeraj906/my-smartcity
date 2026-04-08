import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function ShopManagement() {
  const [shop, setShop] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    API.get('/api/shops/my').then(res => {
      if (res.data) {
        setShop(res.data);
        setForm({ name: res.data.name || '', description: res.data.description || '' });
        setIsNew(false);
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isNew
        ? await API.post('/api/shops', form)
        : await API.put('/api/shops', form);
      setShop(res.data);
      setIsNew(false);
      setMessage(isNew ? 'Shop created!' : 'Shop updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('/api/shops/image', formData);
      setShop(res.data);
      setMessage('Image uploaded!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Image upload failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isNew ? 'Create Shop' : 'Manage Shop'}</h1>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

      <div className="bg-white rounded-lg shadow p-6">
        {shop && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {shop.image ? (
                <img src={`http://localhost:8080/uploads/${shop.image}`} alt="Shop"
                  className="w-full h-full object-cover" />
              ) : <span className="text-4xl">🏪</span>}
            </div>
            <label className="text-indigo-600 cursor-pointer hover:underline text-sm">
              Change Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full border rounded-lg px-3 py-2" rows={4} />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            {isNew ? 'Create Shop' : 'Update Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}
