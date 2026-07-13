import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MoreHorizontal,
} from 'lucide-react';

interface MobileNavProps {
  onOpenSidebar: () => void; // برای باز کردن سایدبار با دکمه "بیشتر"
}

const MobileNav = ({ onOpenSidebar }: MobileNavProps) => {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-800 border-t border-gray-700 lg:hidden z-20">
      <div className="flex justify-around items-center h-16 px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
              isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`
          }
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-xs mt-1">داشبورد</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
              isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`
          }
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">سفارش‌ها</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
              isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`
          }
        >
          <Package className="h-6 w-6" />
          <span className="text-xs mt-1">محصولات</span>
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
              isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`
          }
        >
          <Users className="h-6 w-6" />
          <span className="text-xs mt-1">مشتریان</span>
        </NavLink>

        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <MoreHorizontal className="h-6 w-6" />
          <span className="text-xs mt-1">بیشتر</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;