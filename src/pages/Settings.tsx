import { useState } from 'react';

interface StoreSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  shippingCost: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    siteName: 'فروشگاه من',
    siteDescription: 'توضیح کوتاه درباره فروشگاه',
    contactEmail: 'info@example.com',
    contactPhone: '۰۲۱-۱۲۳۴۵۶۷۸',
    address: 'تهران، خیابان اصلی، پلاک ۱',
    currency: 'تومان',
    shippingCost: 50000,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // اینجا می‌توانید داده‌ها را به API ارسال کنید
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-100">⚙️ تنظیمات فروشگاه</h1>

      <form onSubmit={handleSubmit} className="bg-gray-750 border border-gray-700 rounded-xl p-6 space-y-6">
        {/* بخش عمومی */}
        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">اطلاعات عمومی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">نام فروشگاه</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">توضیحات کوتاه</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* بخش تماس */}
        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">اطلاعات تماس</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">ایمیل</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">تلفن</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">آدرس</label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* بخش مالی */}
        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">تنظیمات مالی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">واحد پول</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              >
                <option value="تومان">تومان</option>
                <option value="دلار">دلار</option>
                <option value="یورو">یورو</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">هزینه ارسال پیش‌فرض</label>
              <input
                type="number"
                value={settings.shippingCost}
                onChange={(e) => handleChange('shippingCost', +e.target.value)}
                className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-3 border border-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {saved && <span className="text-green-400 self-center text-sm">تغییرات ذخیره شد!</span>}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  );
}