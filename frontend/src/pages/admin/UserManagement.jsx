import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    API.get('/api/admin/users').then(res => setUsers(res.data));
  };

  const toggleBlock = async (userId, blocked) => {
    await API.put(`/api/admin/users/${userId}/${blocked ? 'unblock' : 'block'}`);
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm">{user.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{user.username}</td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'SELLER' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>{user.blocked ? 'Blocked' : 'Active'}</span>
                </td>
                <td className="px-6 py-4">
                  {user.role !== 'ADMIN' && (
                    <button onClick={() => toggleBlock(user.id, user.blocked)}
                      className={`px-3 py-1 rounded text-sm text-white ${
                        user.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}>
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
