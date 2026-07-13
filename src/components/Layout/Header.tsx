import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, Search, Bell, User, LogOut, Settings, ChevronDown,
  ShoppingCart, TrendingUp, Package, Zap, X
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// ========== تایپ‌های اضافه‌شده (حداقل تغییر) ==========
interface AdminHeaderProps {
  onMenuClick: () => void;
}

interface SearchResult {
  type: 'user' | 'product' | 'order';
  title: string;
  subtitle: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface ProductData {
  id: number;
  name: string;
  price: number;
}

interface OrderData {
  id: number;
  customer: string;
  total: number;
}
// =================================================

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // آمار لحظه‌ای (استفاده خواهد شد)
  const stats = {
    orders: 12,
    revenue: '۲.۵M',
    visitors: 847,
  };

  // دریافت داده‌ها برای جستجو (همان تابع قبلی + تایپ‌ها)
  const fetchSearchData = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await axiosInstance.get('/db.json');
      const lowerQuery = query.toLowerCase();
      const results: SearchResult[] = [];

      data.users?.forEach((user: UserData) => {
        if (
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            type: 'user',
            title: user.name,
            subtitle: user.email,
            link: '/users',
            icon: User,
          });
        }
      });

      data.products?.forEach((product: ProductData) => {
        if (product.name.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'product',
            title: product.name,
            subtitle: `${product.price.toLocaleString()} تومان`,
            link: '/products',
            icon: Package,
          });
        }
      });

      data.orders?.forEach((order: OrderData) => {
        if (
          order.customer.toLowerCase().includes(lowerQuery) ||
          String(order.id).includes(lowerQuery)
        ) {
          results.push({
            type: 'order',
            title: `سفارش #${order.id}`,
            subtitle: `${order.customer} - ${order.total.toLocaleString()} تومان`,
            link: '/orders',
            icon: ShoppingCart,
          });
        }
      });

      setSearchResults(results.slice(0, 8));
    } catch (error) {
      console.error('خطا در جستجو:', error);
      setSearchResults([]);
    }
  };

  // Debounce (بدون تغییر)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchData(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // بستن منوی جستجو با کلیک بیرون (تایپ event)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // کلیک روی هر نتیجه (تایپ link)
  const handleResultClick = (link: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(link);
  };

  // ========== JSX کاملاً مطابق کد اصلی شما ==========
  return (
    <header className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-30 w-full shadow-2xl shadow-black/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* سمت راست */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 lg:hidden relative group"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ادمین پنل
                </h1>
                <p className="text-xs text-gray-500 -mt-1">فروشگاه آنلاین</p>
              </div>
            </Link>
          </div>

          {/* جستجوی هوشمند */}
          <div className="hidden md:block flex-1 max-w-lg mx-8" ref={searchRef}>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="جستجوی کاربر، محصول، سفارش..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="block w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30 transition-all text-sm shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* نتایج جستجو */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {searchResults.map((result, index) => {
                      const Icon = result.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result.link)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                            <Icon className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-sm font-medium">{result.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{result.subtitle}</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-gray-700 text-gray-400">
                            {result.type === 'user' ? 'کاربر' : result.type === 'product' ? 'محصول' : 'سفارش'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-700 bg-gray-750 text-center">
                    <span className="text-xs text-gray-500">
                      {searchResults.length} نتیجه یافت شد
                    </span>
                  </div>
                </div>
              )}

              {isSearchOpen && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    نتیجه‌ای یافت نشد
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* سمت چپ */}
          <div className="flex items-center gap-1.5">
            {/* آمار لحظه‌ای (استفاده از stats) */}
            <div className="hidden lg:flex items-center gap-3 mr-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">+{stats.revenue}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700">
                <ShoppingCart className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">{stats.orders} سفارش</span>
              </div>
            </div>

            {/* اعلان‌ها (isNotificationsOpen و setIsNotificationsOpen استفاده می‌شود) */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 relative group"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-gray-900"></span>
                </span>
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                  <div className="origin-top-left absolute left-0 mt-3 w-96 rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 focus:outline-none z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-700 bg-gray-750">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">اعلان‌ها</h3>
                        <span className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">۳ جدید</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
                      <div className="px-4 py-3.5 hover:bg-gray-700/50 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <ShoppingCart className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-200 font-medium">سفارش جدید #۱۰۴۵</p>
                            <p className="text-xs text-gray-400 mt-1">سارا احمدی - ۲.۵ میلیون تومان</p>
                            <p className="text-xs text-gray-500 mt-1">۵ دقیقه پیش</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                        </div>
                      </div>
                      <div className="px-4 py-3.5 hover:bg-gray-700/50 transition-colors cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <User className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-200 font-medium">ثبت‌نام کاربر جدید</p>
                            <p className="text-xs text-gray-400 mt-1">رضا محمدی - reza@email.com</p>
                            <p className="text-xs text-gray-500 mt-1">۲۰ دقیقه پیش</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-700 bg-gray-750">
                      <button className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors py-2 font-medium">
                        مشاهده همه اعلان‌ها
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-gray-700 mx-1 hidden sm:block"></div>

            {/* پروفایل (isProfileOpen و setIsProfileOpen استفاده می‌شود) */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-2 ring-gray-700 group-hover:ring-indigo-500 transition-all shadow-lg">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900"></div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-200">مدیر سایت</p>
                  <p className="text-xs text-gray-400">مدیر ارشد</p>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="origin-top-left absolute left-0 mt-3 w-64 rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-700 bg-gray-750">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-2 ring-gray-600 shadow-lg">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">مدیر سایت</p>
                          <p className="text-xs text-gray-400">admin@example.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-1.5">
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm group">
                        <User className="h-4.5 w-4.5 text-gray-400 group-hover:text-white transition-colors" />
                        <span>پروفایل من</span>
                      </Link>
                      <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm group">
                        <Settings className="h-4.5 w-4.5 text-gray-400 group-hover:text-white transition-colors" />
                        <span>تنظیمات</span>
                      </Link>
                      <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm group">
                        <Package className="h-4.5 w-4.5 text-gray-400 group-hover:text-white transition-colors" />
                        <span>سفارش‌های من</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-700 p-3">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm group">
                        <LogOut className="h-4.5 w-4.5" />
                        <span>خروج از حساب کاربری</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;