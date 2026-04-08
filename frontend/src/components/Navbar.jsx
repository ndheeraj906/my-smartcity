import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">SmartCity E-Commerce</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <>
                  <Link to="/customer/products" className="hover:text-indigo-200">Products</Link>
                  <Link to="/customer/cart" className="hover:text-indigo-200">Cart</Link>
                  <Link to="/customer/orders" className="hover:text-indigo-200">Orders</Link>
                  <Link to="/customer/profile" className="hover:text-indigo-200">Profile</Link>
                </>
              )}
              {user.role === 'SELLER' && (
                <>
                  <Link to="/seller" className="hover:text-indigo-200">Dashboard</Link>
                  <Link to="/seller/shop" className="hover:text-indigo-200">Shop</Link>
                  <Link to="/seller/products" className="hover:text-indigo-200">Products</Link>
                  <Link to="/seller/orders" className="hover:text-indigo-200">Orders</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <Link to="/admin" className="hover:text-indigo-200">Dashboard</Link>
                  <Link to="/admin/users" className="hover:text-indigo-200">Users</Link>
                  <Link to="/admin/products" className="hover:text-indigo-200">Products</Link>
                  <Link to="/admin/orders" className="hover:text-indigo-200">Orders</Link>
                </>
              )}
              <span className="text-indigo-200 text-sm">({user.role})</span>
              <button onClick={handleLogout} className="bg-indigo-700 px-3 py-1 rounded hover:bg-indigo-800">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200">Login</Link>
              <Link to="/register" className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
