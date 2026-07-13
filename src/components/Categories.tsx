import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../hooks/useCategories';
// ساختار داده برای فرم
interface CategoryFormData {
  name: string;
  parentId: number | null;
}

// مقدار اولیه فرم
const initialForm: CategoryFormData = { name: '', parentId: null };

export default function Categories() {
  const { data: categories = [], isLoading, isError, error } = useCategories();

  // state های مدیریت فرم
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ساخت درخت دسته‌بندی (گروه‌بندی والدین و فرزندان)
  const parentCategories = categories.filter((c) => c.parentId === null);
  const getChildren = (parentId: number) =>
    categories.filter((c) => c.parentId === parentId);

  // باز کردن فرم برای افزودن
  const handleAdd = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  // باز کردن فرم برای ویرایش
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, parentId: category.parentId });
    setIsFormOpen(true);
  };

  // ذخیره (افزودن یا ویرایش) – در این نسخه فقط state محلی تغییر می‌کند
  const handleSave = () => {
    // اینجا می‌توان با API ارتباط گرفت، فعلاً صرفاً فرم بسته می‌شود
    alert('تغییرات با موفقیت ذخیره شدند (نمونه محلی)');
    setIsFormOpen(false);
  };

  // حذف دسته
  const handleDelete = (id: number) => {
    // برای حذف واقعی در نسخه نهایی باید API فراخوانی شود
    alert(`دسته با شناسه ${id} حذف شد (نمونه محلی)`);
    setDeleteConfirm(null);
  };

  // نمایش سلسله مراتب با تورفتگی
  const renderTree = (parentId: number | null, level = 0) => {
    const items = categories.filter((c) => c.parentId === parentId);
    return items.map((cat) => (
      <tr key={cat.id} className="hover:bg-gray-700/50 transition-colors">
        <td className="px-6 py-3 whitespace-nowrap text-gray-200" style={{ paddingRight: `${level * 24 + 24}px` }}>
          {level > 0 && <span className="text-gray-500 mr-2">└─</span>}
          {cat.name}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-gray-300">
          {cat.parentId ? categories.find((c) => c.id === cat.parentId)?.name || '—' : 'دسته اصلی'}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-gray-300 text-center">{cat.productCount}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">
          <button
            onClick={() => handleEdit(cat)}
            className="text-indigo-400 hover:text-indigo-300 ml-2"
          >
            ویرایش
          </button>
          <button
            onClick={() => setDeleteConfirm(cat.id)}
            className="text-red-400 hover:text-red-300"
          >
            حذف
          </button>
        </td>
      </tr>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
        در حال بارگذاری دسته‌بندی‌ها...
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
      {/* هدر و دکمه افزودن */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">📂 مدیریت دسته‌بندی‌ها</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span> افزودن دسته جدید
        </button>
      </div>

      {/* جدول دسته‌بندی‌ها */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                نام دسته
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                والد
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                تعداد محصولات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {parentCategories.map((parent) => (
              <>
                {renderTree(parent.id, 0)}
                {getChildren(parent.id).length > 0 &&
                  getChildren(parent.id).map((child) => renderTree(child.id, 1))}
              </>
            ))}
            {categories.filter((c) => c.parentId === null && !parentCategories.includes(c)).length === 0 &&
              categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    هیچ دسته‌بندی یافت نشد.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Modal فرم افزودن/ویرایش */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">نام دسته</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                  placeholder="مثال: لوازم خانگی"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">دسته والد (اختیاری)</label>
                <select
                  value={formData.parentId ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentId: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">بدون والد (دسته اصلی)</option>
                  {parentCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsFormOpen(false)}
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
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm border border-gray-700">
            <p className="text-gray-100 mb-4">آیا از حذف این دسته اطمینان دارید؟</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
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