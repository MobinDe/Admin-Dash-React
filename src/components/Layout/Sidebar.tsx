import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  UserCheck,
  FolderTree,
  Tag,
  BarChart,
  Star,
  Mail,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'داشبورد', icon: LayoutDashboard, path: '/' },
  { name: 'سفارش‌ها', icon: ShoppingCart, path: '/orders' },
  { name: 'محصولات', icon: Package, path: '/products' },
  { name: 'کاربران', icon: Users, path: '/users' },
  { name: 'مشتریان', icon: UserCheck, path: '/customers' },          // آیکن متفاوت برای مشتریان
  { name: 'دسته‌بندی‌ها', icon: FolderTree, path: '/categories' },
  { name: 'کدهای تخفیف', icon: Tag, path: '/discounts' },
  { name: 'گزارش‌ها', icon: BarChart, path: '/reports' },
  { name: 'نظرات', icon: Star, path: '/reviews' },
  { name: 'پیام‌ها', icon: Mail, path: '/messages' },
  { name: 'تنظیمات', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay برای موبایل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* سایدبار */}
      <aside
        className={`fixed top-0 right-0 z-30 h-full w-64 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* هدر سایدبار */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-lg font-bold text-white">منوی ادمین</span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* آیتم‌های منو */}
        <nav className="mt-4 px-0 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose} // بستن سایدبار در موبایل
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 mx-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="ml-3 h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* دکمه خروج */}
          <div className="border-t border-gray-700 mt-4 pt-2">
            <a
              href="/logout"
              className="flex items-center mx-2 px-4 py-2.5 text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="ml-3 h-5 w-5" />
              <span>خروج</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;