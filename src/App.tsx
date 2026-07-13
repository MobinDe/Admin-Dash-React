import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import AdminHeader from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import CustomersPage from './pages/Customers';
import CategoriesPage from './pages/CategoriesPage';
import DiscountsPage from './pages/Discounts';
import ReportsPage from './pages/Reports';
import ReviewsPage from './pages/Reviews';
import MessagesPage from './pages/Messages';
import SettingsPage from './pages/Settings';
import UsersPage from './pages/Users';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import LoginPage from './pages/Login';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden">
        {/* سایدبار: ارتفاع کامل، اسکرول مستقل */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* محتوای اصلی: اسکرول می‌شود */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/discounts" element={<DiscountsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>

      <MobileNav onOpenSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}

export default App;