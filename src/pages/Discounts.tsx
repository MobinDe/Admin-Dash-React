import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface Discount {
  id: number;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  maxUses: number;
  usedCount: number;
  expiry: string;
  status: 'active' | 'expired';
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // فرم
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Discount, 'id' | 'usedCount' | 'status'>>({
    code: '',
    type: 'percent',
    value: 0,
    maxUses: 1,
    expiry: '',
  });

  // تأیید حذف
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // دریافت داده‌ها
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/db.json');
      setDiscounts(data.discounts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // باز کردن فرم برای افزودن
  const openAddForm = () => {
    setEditId(null);
    setForm({ code: '', type: 'percent', value: 0, maxUses: 1, expiry: '' });
    setShowForm(true);
  };

  // باز کردن فرم برای ویرایش
  const openEditForm = (discount: Discount) => {
    setEditId(discount.id);
    setForm({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      maxUses: discount.maxUses,
      expiry: discount.expiry,
    });
    setShowForm(true);
  };

  // ذخیره (افزودن/ویرایش) – موقتاً با تغییر state نمایشی
  const handleSave = () => {
    if (!form.code || !form.expiry) return;
    if (editId) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editId ? { ...d, ...form } : d
        )
      );
    } else {
      const newId = Math.max(0, ...discounts.map((d) => d.id)) + 1;
      setDiscounts((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          usedCount: 0,
          status: 'active',
        },
      ]);
    }
    setShowForm(false);
  };

  // حذف
  const handleDelete = () => {
    if (deleteId) {
      setDiscounts((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
        در حال بارگذاری کدهای تخفیف...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6 space-y-6">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">🎟️ کدهای تخفیف</h1>
        <button
          onClick={openAddForm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> افزودن کد جدید
        </button>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              {['کد', 'نوع', 'مقدار', 'مصرف/حداکثر', 'انقضا', 'وضعیت', 'عملیات'].map((h) => (
                <th key={h} className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">هیچ کد تخفیفی ثبت نشده است.</td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap text-gray-200 font-mono">{d.code}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-300">
                    {d.type === 'percent' ? 'درصدی' : 'مبلغ ثابت'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-300 dir-ltr">
                    {d.type === 'percent' ? `${d.value}%` : `${d.value.toLocaleString()} تومان`}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-300 dir-ltr text-center">
                    {d.usedCount} / {d.maxUses}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-300 dir-ltr">{d.expiry}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                        d.status === 'active'
                          ? 'bg-green-900/60 text-green-200'
                          : 'bg-red-900/60 text-red-200'
                      }`}
                    >
                      {d.status === 'active' ? 'فعال' : 'منقضی'}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => openEditForm(d)}
                      className="text-indigo-400 hover:text-indigo-300 ml-3"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => setDeleteId(d.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal فرم افزودن/ویرایش */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              {editId ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">کد</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
                  placeholder="مثلاً SUMMER20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">نوع</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
                >
                  <option value="percent">درصدی</option>
                  <option value="fixed">مبلغ ثابت</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  {form.type === 'percent' ? 'درصد' : 'مبلغ (تومان)'}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: +e.target.value })}
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">حداکثر دفعات استفاده</label>
                <input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: +e.target.value })}
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">تاریخ انقضا</label>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
                  placeholder="مثلاً ۱۴۰۳/۰۶/۳۱"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal تأیید حذف */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm border border-gray-700">
            <p className="text-gray-100 mb-4">آیا از حذف این کد اطمینان دارید؟</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}