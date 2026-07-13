// dashboard/RecentOrders.tsx
import { MoreHorizontal } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: 'پرداخت شده' | 'در حال پردازش' | 'ارسال شده' | 'لغو شده';
  date: string;
}

const orders: Order[] = [
  { id: '#12456', customer: 'احمد رضایی', amount: '۳۲۰,۰۰۰ تومان', status: 'پرداخت شده', date: '۱۴۰۲/۱۱/۰۵' },
  { id: '#12457', customer: 'مریم حسینی', amount: '۵۶۰,۰۰۰ تومان', status: 'در حال پردازش', date: '۱۴۰۲/۱۱/۰۴' },
  { id: '#12458', customer: 'علی کریمی', amount: '۱۲۰,۰۰۰ تومان', status: 'ارسال شده', date: '۱۴۰۲/۱۱/۰۳' },
  { id: '#12459', customer: 'سارا محمدی', amount: '۹۸۰,۰۰۰ تومان', status: 'پرداخت شده', date: '۱۴۰۲/۱۱/۰۲' },
  { id: '#12460', customer: 'رضا احمدی', amount: '۴۵۰,۰۰۰ تومان', status: 'لغو شده', date: '۱۴۰۲/۱۱/۰۱' },
];

const statusColors = {
  'پرداخت شده': 'bg-green-500/20 text-green-400',
  'در حال پردازش': 'bg-yellow-500/20 text-yellow-400',
  'ارسال شده': 'bg-blue-500/20 text-blue-400',
  'لغو شده': 'bg-red-500/20 text-red-400',
};

const RecentOrders = () => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">سفارش‌های اخیر</h3>
        <button className="text-sm text-blue-400 hover:text-blue-300 transition">مشاهده همه</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">شماره سفارش</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">مشتری</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">مبلغ</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">وضعیت</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">تاریخ</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-500 hover:text-gray-300">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;