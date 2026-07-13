// components/OrderTable.tsx
import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// نمونه داده (در پروژه واقعی از API دریافت کنید)
const sampleOrders: Order[] = [
  { id: '#ORD-001', customer: 'احمد رضایی', date: '۱۴۰۲/۱۱/۱۰', total: '۳۲۰,۰۰۰ تومان', status: 'delivered' },
  { id: '#ORD-002', customer: 'سارا محمدی', date: '۱۴۰۲/۱۱/۱۱', total: '۵۶۰,۰۰۰ تومان', status: 'processing' },
  { id: '#ORD-003', customer: 'علی کریمی', date: '۱۴۰۲/۱۱/۰۹', total: '۱۲۰,۰۰۰ تومان', status: 'shipped' },
  { id: '#ORD-004', customer: 'مریم حسینی', date: '۱۴۰۲/۱۱/۱۲', total: '۹۸۰,۰۰۰ تومان', status: 'pending' },
  { id: '#ORD-005', customer: 'رضا احمدی', date: '۱۴۰۲/۱۱/۰۸', total: '۴۵۰,۰۰۰ تومان', status: 'cancelled' },
];

const ITEMS_PER_PAGE = 5;

const OrderTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // فیلتر بر اساس جستجو
  const filteredOrders = sampleOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.includes(searchTerm)
  );

  // صفحه‌بندی
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
      {/* هدر با جستجو */}
      <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-semibold text-white">لیست سفارشات</h3>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="جستجوی شماره سفارش یا مشتری..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-700 border border-gray-600 rounded-md py-2 pr-10 pl-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">شماره سفارش</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">مشتری</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">تاریخ</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">مبلغ</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.total}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  سفارشی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-400">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTable;