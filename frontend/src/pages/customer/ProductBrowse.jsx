import { useEffect, useState } from 'react';
import API, { BASE_URL } from '../../api/axios';
export default function ProductBrowse() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/api/products/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    const params = { page, size: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    try {
      const res = await API.get('/api/products', { params });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const addToCart = async (productId) => {
    try {
      await API.post('/api/cart', { productId, quantity: 1 });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3">
        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border rounded px-3 py-2" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)}
          className="w-24 border rounded px-3 py-2" />
        <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
          className="w-24 border rounded px-3 py-2" />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Search</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.image ? (
                <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.name}
                  className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400 text-4xl">📦</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm truncate">{product.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xl font-bold text-indigo-600">${product.price?.toFixed(2)}</span>
                <span className="text-xs text-gray-400">{product.stock} in stock</span>
              </div>
              {product.category && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-2">
                  {product.category}
                </span>
              )}
              <button onClick={() => addToCart(product.id)}
                className="w-full mt-3 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                disabled={product.stock === 0}>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && <p className="text-center text-gray-500 mt-8">No products found</p>}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <span className="px-4 py-2">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
