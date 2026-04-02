/**
 * Admin Dashboard Page
 * Overview with revenue chart, orders count, top products
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  products: number;
  customers: number;
}

interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  image: string;
}

const mockStats: DashboardStats = {
  revenue: { current: 12540, previous: 10200, change: 23 },
  orders: { current: 84, previous: 72, change: 17 },
  products: 156,
  customers: 342,
};

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'Pro Website Template', revenue: 4200, orders: 28, image: '/placeholder.png' },
  { id: '2', name: 'Premium Icon Set', revenue: 2100, orders: 42, image: '/placeholder.png' },
  { id: '3', name: 'UI Kit Pro', revenue: 1850, orders: 15, image: '/placeholder.png' },
  { id: '4', name: '3D Asset Pack', revenue: 1240, orders: 8, image: '/placeholder.png' },
  { id: '5', name: 'Motion Graphics Bundle', revenue: 980, orders: 12, image: '/placeholder.png' },
];

const mockRecentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 299, status: 'completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 149, status: 'processing', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: 599, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Alice Brown', amount: 89, status: 'completed', date: '2024-01-14' },
];

function StatCard({ title, value, change, icon: Icon, trend }: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-400 mb-1">{title}</p>
            <p className="font-display text-2xl font-semibold">{value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
              <span className="text-neutral-500 ml-1">vs last month</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-800">
            <Icon className="w-5 h-5 text-primary-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [topProducts] = useState<TopProduct[]>(mockTopProducts);
  const [recentOrders] = useState(mockRecentOrders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats.revenue.current)}
            change={stats.revenue.change}
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders.current}
            change={stats.orders.change}
            icon={ShoppingCart}
            trend="up"
          />
          <StatCard
            title="Products"
            value={stats.products}
            change={5}
            icon={Package}
            trend="up"
          />
          <StatCard
            title="Customers"
            value={stats.customers}
            change={12}
            icon={Users}
            trend="up"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Badge variant="secondary">This Month</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-neutral-500">
                      #{index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-neutral-800 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-neutral-400">{product.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(product.revenue)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <a href="/admin/orders" className="text-sm text-primary-400 hover:text-primary-300">
                View All
              </a>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-neutral-400">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.amount)}</p>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'success'
                            : order.status === 'processing'
                            ? 'primary'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
