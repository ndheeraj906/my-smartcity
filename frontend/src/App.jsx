import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProductBrowse from './pages/customer/ProductBrowse';
import Cart from './pages/customer/Cart';
import OrderHistory from './pages/customer/OrderHistory';
import Profile from './pages/customer/Profile';
import SellerDashboard from './pages/seller/SellerDashboard';
import ShopManagement from './pages/seller/ShopManagement';
import ProductManagement from './pages/seller/ProductManagement';
import SellerOrders from './pages/seller/SellerOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          <Route path="/" element={
            user ? (
              user.role === 'CUSTOMER' ? <Navigate to="/customer" /> :
              user.role === 'SELLER' ? <Navigate to="/seller" /> :
              <Navigate to="/admin" />
            ) : <Navigate to="/login" />
          } />

          <Route path="/customer" element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/products" element={<ProtectedRoute role="CUSTOMER"><ProductBrowse /></ProtectedRoute>} />
          <Route path="/customer/cart" element={<ProtectedRoute role="CUSTOMER"><Cart /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute role="CUSTOMER"><OrderHistory /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute role="CUSTOMER"><Profile /></ProtectedRoute>} />

          <Route path="/seller" element={<ProtectedRoute role="SELLER"><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/shop" element={<ProtectedRoute role="SELLER"><ShopManagement /></ProtectedRoute>} />
          <Route path="/seller/products" element={<ProtectedRoute role="SELLER"><ProductManagement /></ProtectedRoute>} />
          <Route path="/seller/orders" element={<ProtectedRoute role="SELLER"><SellerOrders /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
