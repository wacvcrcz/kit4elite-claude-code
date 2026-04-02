/**
 * Admin Orders Page
 * Order management with status updates
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatDate } from '@/lib/utils';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: 'Pending', color: 'bg-amber-500', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
};

const statusFlow: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { id: '1', name: 'Pro Website Template', quantity: 1, price: 149, image: '' },
    ],
    subtotal: 149,
    discount: 0,
    shipping: 0,
    total: 149,
    status: 'delivered',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      { id: '2', name: 'Premium Icon Set', quantity: 2, price: 49, image: '' },
      { id: '3', name: 'UI Kit Pro', quantity: 1, price: 199, image: '' },
    ],
    subtotal: 297,
    discount: 29.7,
    shipping: 0,
    total: 267.3,
    status: 'processing',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA',
    },
    createdAt: '2024-01-16T08:15:00Z',
    updatedAt: '2024-01-17T09:45:00Z',
  },
  {
    id: 'ORD-003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    items: [
      { id: '4', name: '3D Asset Pack', quantity: 1, price: 299, image: '' },
    ],
    subtotal: 299,
    discount: 0,
    shipping: 15,
    total: 314,
    status: 'pending',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA',
    },
    createdAt: '2024-01-17T15:45:00Z',
    updatedAt: '2024-01-17T15:45:00Z',
  },
  {
    id: 'ORD-004',
    customerName: 'Alice Brown',
    customerEmail: 'alice@example.com',
    items: [
      { id: '5', name: 'Motion Graphics Bundle', quantity: 1, price: 89, image: '' },
    ],
    subtotal: 89,
    discount: 0,
    shipping: 0,
    total: 89,
    status: 'shipped',
    shippingAddress: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA',
    },
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-17T16:30:00Z',
  },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant="secondary" className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      {config.label}
    </Badge>
  );
}

function OrderDetail({ order, onClose, onStatusChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const currentIndex = statusFlow.indexOf(order.status);
  const canAdvance = currentIndex < statusFlow.length - 1 && order.status !== 'cancelled';
  const nextStatus = canAdvance ? statusFlow[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">{order.id}</h3>
          <p className="text-sm text-neutral-400 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {canAdvance && nextStatus && (
            <Button
              size="sm"
              onClick={() => onStatusChange(order.id, nextStatus)}
            >
              Mark as {statusConfig[nextStatus].label}
            </Button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Customer Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-400">Name</p>
              <p>{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p>{order.customerEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Shipping Address</h4>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zip}
          </p>
          <p>{order.shippingAddress.country}</p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Items</h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-neutral-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p>{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Discount</span>
                <span className="text-emerald-400">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            {order.shipping > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
            )}
            <div className="border-t border-neutral-700 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <AdminLayout title="Orders">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter === 'all' ? 'All Status' : statusConfig[statusFilter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Status
              </DropdownMenuItem>
              {Object.entries(statusConfig).map(([status, config]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status as OrderStatus)}
                >
                  {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-neutral-800">
                <tr>
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Total</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-800/50 hover:bg-neutral-800/30"
                  >
                    <td className="p-4">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-neutral-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button variant="ghost" size="sm" disabled>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetail
              order={selectedOrder}
              onClose={() => setIsDetailOpen(false)}
              onStatusChange={handleStatusChange}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
