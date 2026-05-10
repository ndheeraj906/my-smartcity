import { useEffect, useState } from 'react';
import API, { BASE_URL } from '../../api/axios';
export default function Profile() {
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/api/users/me').then(res => setProfile(res.data)).catch(() => {});
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/api/users/me', profile);
      setProfile(res.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Update failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('/api/users/me/image', formData);
      setProfile(res.data);
      setMessage('Image uploaded!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Image upload failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profile.profileImage ? (
              <img src={`${BASE_URL}/uploads/${profile.profileImage}`} alt="Profile"
                className="w-full h-full object-cover" />
            ) : <span className="text-4xl">👤</span>}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.username}</h2>
            <label className="text-indigo-600 cursor-pointer hover:underline text-sm">
              Change Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" value={profile.fullName || ''} onChange={e => setProfile({...profile, fullName: e.target.value})}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
