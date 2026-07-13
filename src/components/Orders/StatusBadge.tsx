// components/StatusBadge.tsx
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-yellow-500/20 text-yellow-400' },
  processing: { label: 'در حال پردازش', color: 'bg-blue-500/20 text-blue-400' },
  shipped: { label: 'ارسال شده', color: 'bg-purple-500/20 text-purple-400' },
  delivered: { label: 'تحویل داده شده', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'لغو شده', color: 'bg-red-500/20 text-red-400' },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, color } = statusConfig[status];
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;