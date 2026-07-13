// dashboard/StatsCards.tsx
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  changeType: 'up' | 'down';
  color: string;
}

const StatCard = ({ title, value, icon: Icon, change, changeType, color }: StatCardProps) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color}-500/20`}>
        <Icon className={`h-6 w-6 text-${color}-400`} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`${changeType === 'up' ? 'text-green-500' : 'text-red-500'} font-medium`}>
        {change}
      </span>
      <span className="text-gray-400 mr-2">نسبت به ماه قبل</span>
    </div>
  </div>
);

const StatsCards = () => {
  const stats = [
    {
      title: 'درآمد کل',
      value: '۱۲,۴۵۰,۰۰۰ تومان',
      icon: DollarSign,
      change: '+۱۲.۵٪',
      changeType: 'up' as const,
      color: 'blue',
    },
    {
      title: 'سفارش‌ها',
      value: '۳۵۲',
      icon: ShoppingBag,
      change: '+۸.۲٪',
      changeType: 'up' as const,
      color: 'green',
    },
    {
      title: 'مشتریان جدید',
      value: '۱,۲۰۳',
      icon: Users,
      change: '+۲۳.۱٪',
      changeType: 'up' as const,
      color: 'purple',
    },
    {
      title: 'نرخ تبدیل',
      value: '۳.۲۴٪',
      icon: TrendingUp,
      change: '-۱.۵٪',
      changeType: 'down' as const,
      color: 'yellow',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;