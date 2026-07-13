import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Package, Calendar, DollarSign, Truck, AlertCircle } from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
        fetchOrders(user.name);
      } catch {
        setUserName(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (customerName: string) => {
    try {
      const { data } = await axiosInstance.get('/db.json');
      const userOrders = data.orders.filter((order: Order) => order.customer === customerName);
      setOrders(userOrders);
    } catch (error) {
      console.error('خطا در دریافت سفارش‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userName) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-8 text-center max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-200 mb-2">وارد نشده‌اید</h2>
          <p className="text-gray-400 mb-6">برای مشاهده سفارش‌های خود ابتدا وارد شوید.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            رفتن به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-100">📦 سفارش‌های من</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
            در حال بارگذاری...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-700 border border-gray-600 rounded-xl p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">شما هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Package className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">سفارش #{order.id}</h3>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">مبلغ</p>
                      <p className="text-gray-200 font-medium flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        {order.total.toLocaleString()} تومان
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">وضعیت</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'تحویل شده'
                            ? 'bg-green-900/60 text-green-200'
                            : order.status === 'ارسال شده'
                            ? 'bg-blue-900/60 text-blue-200'
                            : order.status === 'در حال پردازش'
                            ? 'bg-yellow-900/60 text-yellow-200'
                            : 'bg-red-900/60 text-red-200'
                        }`}
                      >
                        <Truck className="h-3 w-3" />
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}