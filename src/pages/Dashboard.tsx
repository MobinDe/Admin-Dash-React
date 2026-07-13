// src/pages/DashboardPage.tsx
import StatsCards from '../components/Dashboard/StatsCards';

import RecentOrders from '../components/Dashboard/RecentOrders';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">داشبورد ادمین</h1>
        <StatsCards />
      </div>

     

      <div>
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;