import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

export default function Users() {
  const { data: users = [], isLoading, isError, error } = useUsers();
  const [search, setSearch] = useState('');
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // حذف کاربر (افزودن شناسه به لیست حذف‌شده‌ها)
  const handleDelete = (userId: number) => {
    setDeletedIds((prev) => [...prev, userId]);
  };

  // فیلتر کاربران بر اساس جستجو و حذف‌شده‌ها
  const filtered = users
    .filter((user) => !deletedIds.includes(user.id))
    .filter(
      (user) =>
        user.name.includes(search) || user.email.includes(search)
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
        در حال بارگذاری کاربران...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
        خطا در دریافت اطلاعات: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر بخش */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">👥 مدیریت کاربران</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <span>+</span> افزودن کاربر جدید
        </button>
      </div>

      {/* نوار جستجو */}
      <div className="relative">
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="جستجوی نام یا ایمیل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg py-2.5 pr-10 pl-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* جدول کاربران */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              {['نام', 'ایمیل', 'نقش', 'وضعیت', 'تاریخ عضویت', 'عملیات'].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  هیچ کاربری یافت نشد.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200 font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 dir-ltr text-left">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full
                        ${
                          user.role === 'Admin'
                            ? 'bg-purple-900/60 text-purple-200'
                            : user.role === 'Editor'
                            ? 'bg-blue-900/60 text-blue-200'
                            : 'bg-gray-600/60 text-gray-300'
                        }`}
                    >
                      {user.role === 'Admin' ? 'مدیر' : user.role === 'Editor' ? 'ویرایشگر' : 'بازدیدکننده'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full
                        ${
                          user.status === 'Active'
                            ? 'bg-green-900/60 text-green-200'
                            : 'bg-red-900/60 text-red-200'
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      />
                      {user.status === 'Active' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 dir-ltr text-left">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors duration-200 text-xs font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* پاورقی با آمار */}
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <span>
          نمایش {filtered.length} از {users.length} کاربر
        </span>
        <div className="flex gap-2">
          <button
            className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
            disabled
          >
            قبلی
          </button>
          <button className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition-colors">
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}