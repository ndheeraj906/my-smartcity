import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { fetchProducts(); }, [page]);

  const fetchProducts = () => {
    API.get('/api/products', { params: { page, size: 20 } }).then(res => {
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    await API.delete(`/api/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 text-sm">{p.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{p.name}</td>
                <td className="px-6 py-4 text-sm">${p.price?.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">{p.stock}</td>
                <td className="px-6 py-4 text-sm">{p.category}</td>
                <td className="px-6 py-4 text-sm">{p.shopName}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteProduct(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 bg-white border rounded disabled:opacity-50">Previous</button>
          <span className="px-4 py-2">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
