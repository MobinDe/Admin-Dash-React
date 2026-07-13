import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface DailySale { date: string; total: number }
interface WeeklySale { week: string; total: number }
interface MonthlySale { month: string; total: number }
interface BestSeller { productId: number; name: string; salesCount: number; revenue: number }
interface RevenueComparison { currentMonth: number; previousMonth: number; growth: number }

interface ReportsData {
  dailySales: DailySale[];
  weeklySales: WeeklySale[];
  monthlySales: MonthlySale[];
  bestSellers: BestSeller[];
  revenueComparison: RevenueComparison;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get('/db.json');
        setData(response.data.reports);
      } catch (err: any) {
        setError(err.message || 'خطا در دریافت گزارش‌ها');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
        در حال بارگذاری گزارش‌ها...
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

  if (!data) return null;

  const maxDailyTotal = Math.max(...data.dailySales.map(d => d.total), 1);
  const maxBestRevenue = Math.max(...data.bestSellers.map(p => p.revenue), 1);

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-100">📊 گزارش‌ها</h1>

      {/* خلاصه درآمد و مقایسه ماهانه */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
          <p className="text-sm text-gray-400">درآمد این ماه</p>
          <p className="text-2xl font-bold text-gray-100">{data.revenueComparison.currentMonth.toLocaleString()} تومان</p>
        </div>
        <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
          <p className="text-sm text-gray-400">درآمد ماه قبل</p>
          <p className="text-2xl font-bold text-gray-100">{data.revenueComparison.previousMonth.toLocaleString()} تومان</p>
        </div>
        <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
          <p className="text-sm text-gray-400">رشد نسبت به ماه قبل</p>
          <p className={`text-2xl font-bold ${data.revenueComparison.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.revenueComparison.growth}%
          </p>
        </div>
      </div>

      {/* فروش روزانه */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">📅 فروش روزانه (هفته اخیر)</h2>
        <div className="space-y-3">
          {data.dailySales.map((day) => (
            <div key={day.date} className="flex items-center gap-3">
              <span className="w-20 text-sm text-gray-400">{day.date}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-indigo-500 h-6 rounded-full text-xs text-white flex items-center px-2"
                  style={{ width: `${(day.total / maxDailyTotal) * 100}%` }}
                >
                  {day.total.toLocaleString()} تومان
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* فروش هفتگی */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">📆 فروش هفتگی</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.weeklySales.map((week) => (
            <div key={week.week} className="bg-gray-700/50 border border-gray-600 rounded-lg p-3">
              <p className="text-sm text-gray-400">{week.week}</p>
              <p className="text-lg font-bold text-gray-100">{week.total.toLocaleString()} تومان</p>
            </div>
          ))}
        </div>
      </section>

      {/* فروش ماهانه */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">🗓️ فروش ماهانه</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-2 text-right text-xs text-gray-300">ماه</th>
                <th className="px-4 py-2 text-right text-xs text-gray-300">فروش کل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {data.monthlySales.map((m) => (
                <tr key={m.month} className="hover:bg-gray-700/50">
                  <td className="px-4 py-2 text-gray-200">{m.month}</td>
                  <td className="px-4 py-2 text-gray-300 dir-ltr">{m.total.toLocaleString()} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* محصولات پرفروش */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">🏆 محصولات پرفروش</h2>
        <div className="space-y-3">
          {data.bestSellers.map((product) => (
            <div key={product.productId} className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-400 truncate">{product.name}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-green-500 h-6 rounded-full text-xs text-white flex items-center px-2"
                  style={{ width: `${(product.revenue / maxBestRevenue) * 100}%` }}
                >
                  {product.salesCount} عدد - {product.revenue.toLocaleString()} تومان
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}