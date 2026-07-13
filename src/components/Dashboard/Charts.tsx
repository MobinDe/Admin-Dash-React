// dashboard/Charts.tsx
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: 'دی', فروش: 4200 },
  { name: 'بهمن', فروش: 5800 },
  { name: 'اسفند', فروش: 7100 },
  { name: 'فروردین', فروش: 8900 },
  { name: 'اردیبهشت', فروش: 10200 },
  { name: 'خرداد', فروش: 11300 },
];

const productsData = [
  { name: 'محصول A', فروش: 320 },
  { name: 'محصول B', فروش: 280 },
  { name: 'محصول C', فروش: 210 },
  { name: 'محصول D', فروش: 190 },
];

const Charts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* چارت خطی */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg">
        <h3 className="text-white font-semibold mb-4 px-2">روند فروش ماهانه (میلیون تومان)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="فروش" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* چارت میله‌ای */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg">
        <h3 className="text-white font-semibold mb-4 px-2">پرفروش‌ترین محصولات (تعداد)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="فروش" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;