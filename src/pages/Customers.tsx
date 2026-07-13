import { useState } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  joined: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'سارا احمدی', email: 'sara@example.com', ordersCount: 8, totalSpent: 12500000, joined: '۱۴۰۲/۰۶/۱۵' },
  { id: 2, name: 'رضا محمدی', email: 'reza@example.com', ordersCount: 5, totalSpent: 4300000, joined: '۱۴۰۲/۰۷/۰۱' },
  { id: 3, name: 'مینا رضایی', email: 'mina@example.com', ordersCount: 2, totalSpent: 980000, joined: '۱۴۰۲/۰۵/۲۰' },
  { id: 4, name: 'امیر حسینی', email: 'amir@example.com', ordersCount: 12, totalSpent: 24100000, joined: '۱۴۰۲/۰۸/۰۲' },
  { id: 5, name: 'زهرا مرادی', email: 'zahra@example.com', ordersCount: 3, totalSpent: 5600000, joined: '۱۴۰۲/۰۸/۱۰' },
  { id: 6, name: 'محمد کریمی', email: 'mohammad@example.com', ordersCount: 15, totalSpent: 36700000, joined: '۱۴۰۲/۰۴/۲۲' },
  { id: 7, name: 'فاطمه نوروزی', email: 'fatemeh@example.com', ordersCount: 1, totalSpent: 450000, joined: '۱۴۰۲/۰۹/۰۵' },
  { id: 8, name: 'علی قاسمی', email: 'ali@example.com', ordersCount: 6, totalSpent: 7900000, joined: '۱۴۰۲/۰۹/۱۲' },
  { id: 9, name: 'نرگس صادقی', email: 'narges@example.com', ordersCount: 9, totalSpent: 18200000, joined: '۱۴۰۲/۱۰/۰۱' },
  { id: 10, name: 'حسین رحیمی', email: 'hossein@example.com', ordersCount: 4, totalSpent: 2800000, joined: '۱۴۰۲/۱۰/۰۸' },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');

  // فیلتر بر اساس جستجو
  const filtered = customers.filter(
    (c) =>
      c.name.includes(search) || c.email.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6 space-y-6">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">👥 مشتریان</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <span>+</span> افزودن مشتری جدید
        </button>
      </div>

      {/* جستجو */}
      <div className="relative">
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="جستجوی نام یا ایمیل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg py-2.5 pr-10 pl-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* جدول */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              {['نام', 'ایمیل', 'تعداد سفارش', 'مجموع خرید', 'تاریخ عضویت', 'عملیات'].map((head) => (
                <th key={head} className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  هیچ مشتری‌ای یافت نشد.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200 font-medium">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 dir-ltr text-left">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-center">{customer.ordersCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 dir-ltr">{customer.totalSpent.toLocaleString()} تومان</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">{customer.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2 space-x-reverse">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      جزئیات
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors mr-2">
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* پاورقی */}
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <span>نمایش {filtered.length} از {customers.length} مشتری</span>
        <div className="flex gap-2">
          <button className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50" disabled>قبلی</button>
          <button className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">بعدی</button>
        </div>
      </div>
    </div>
  );
}