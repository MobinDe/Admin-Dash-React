// pages/OrdersPage.tsx
import OrderTable from '../components/Orders/OrderTable';

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">مدیریت سفارشات</h1>
      <OrderTable />
    </div>
  );
};

export default OrdersPage;