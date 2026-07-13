import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', price: 0, stock: 0, category: '' });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('/db.json');
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message || 'خطا در دریافت اطلاعات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueCategoryNames = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.includes(search) || p.category.includes(search);
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  const openAddForm = () => {
    setEditingId(null);
    setForm({ name: '', price: 0, stock: 0, category: '' });
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setForm({ name: product.name, price: product.price, stock: product.stock, category: product.category });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || form.price <= 0) return;
    if (editingId) {
      setProducts(prev => prev.map(p => (p.id === editingId ? { ...p, ...form } : p)));
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1;
      setProducts(prev => [...prev, { id: newId, ...form }]);
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
        در حال بارگذاری محصولات...
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">🛍️ مدیریت محصولات</h1>
        <button onClick={openAddForm} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span>+</span> افزودن محصول جدید
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="جستجوی نام یا دسته‌بندی..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg py-2 pr-10 pl-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">همه دسته‌ها</option>
          {uniqueCategoryNames.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              {['نام', 'قیمت', 'موجودی', 'دسته‌بندی', 'عملیات'].map(h => (
                <th key={h} className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">محصولی یافت نشد.</td></tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200 font-medium">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 dir-ltr">{product.price.toLocaleString()} تومان</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    <span className={product.stock <= 5 ? 'text-red-400 font-semibold' : ''}>{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => openEditForm(product)} className="text-indigo-400 hover:text-indigo-300 ml-3">ویرایش</button>
                    <button onClick={() => setDeleteId(product.id)} className="text-red-400 hover:text-red-300">حذف</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-gray-100 mb-4">{editingId ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">نام محصول</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">قیمت (تومان)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">موجودی</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">دسته‌بندی</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600">
                  <option value="">انتخاب کنید</option>
                  {uniqueCategoryNames.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg">انصراف</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">ذخیره</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm border border-gray-700">
            <p className="text-gray-100 mb-4">آیا از حذف این محصول اطمینان دارید؟</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg">انصراف</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}