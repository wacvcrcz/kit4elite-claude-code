/**
 * Admin Products Page
 * CRUD for products with image upload
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Cuboid,
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
  DialogFooter,
} from '@/components/ui/modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { ProductCardSkeleton } from '@/components/products/product-skeleton';
import { formatPrice, formatDate, capitalize } from '@/lib/utils';
import type { Product, ProductType, Category } from '@/types';

// Mock data - replace with API calls
const mockCategories: Category[] = [
  { id: '1', name: 'Templates', slug: 'templates', description: null, image: null, parentId: null, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Icon Sets', slug: 'icons', description: null, image: null, parentId: null, createdAt: '', updatedAt: '' },
  { id: '3', name: 'UI Kits', slug: 'ui-kits', description: null, image: null, parentId: null, createdAt: '', updatedAt: '' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pro Website Template',
    slug: 'pro-website-template',
    description: 'Modern responsive website template',
    type: 'digital',
    price: 149,
    compareAtPrice: 199,
    images: [{ id: '1', url: '/placeholder.png', alt: 'Template preview', order: 0 }],
    category: mockCategories[0],
    categoryId: '1',
    status: 'active',
    tags: ['website', 'template'],
    metadata: {},
    stock: null,
    downloadUrl: 'https://s3.example.com/template.zip',
    fileSize: '2.4 MB',
    fileFormat: 'ZIP',
    weight: null,
    dimensions: null,
    shippingProfile: null,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Premium T-Shirt',
    slug: 'premium-tshirt',
    description: 'High quality cotton t-shirt',
    type: 'physical',
    price: 49,
    compareAtPrice: null,
    images: [{ id: '2', url: '/placeholder.png', alt: 'T-shirt', order: 0 }],
    category: mockCategories[1],
    categoryId: '2',
    status: 'active',
    tags: ['clothing'],
    metadata: {},
    stock: 25,
    downloadUrl: null,
    fileSize: null,
    fileFormat: null,
    weight: 300,
    dimensions: { length: 30, width: 25, height: 2 },
    shippingProfile: { id: '1', name: 'Standard', baseRate: 5, freeShippingThreshold: 50 },
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
  },
];

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  price: number;
  compareAtPrice: number;
  categoryId: string;
  status: 'active' | 'draft';
  stock: number | string;
  fileSize: string;
  fileFormat: string;
}

export function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    type: 'digital',
    price: 0,
    compareAtPrice: 0,
    categoryId: '',
    status: 'draft',
    stock: '',
    fileSize: '',
    fileFormat: '',
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      type: 'digital',
      price: 0,
      compareAtPrice: 0,
      categoryId: mockCategories[0]?.id || '',
      status: 'draft',
      stock: '',
      fileSize: '',
      fileFormat: '',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      type: product.type,
      price: product.price,
      compareAtPrice: product.compareAtPrice || 0,
      categoryId: product.categoryId,
      status: product.status === 'active' ? 'active' : 'draft',
      stock: product.stock || '',
      fileSize: product.fileSize || '',
      fileFormat: product.fileFormat || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: selectedProduct?.id || Date.now().toString(),
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      stock: formData.type === 'physical' ? Number(formData.stock) || 0 : null,
      fileSize: formData.type === 'digital' ? formData.fileSize : null,
      fileFormat: formData.type === 'digital' ? formData.fileFormat : null,
      downloadUrl: null,
      weight: null,
      dimensions: null,
      shippingProfile: null,
      images: selectedProduct?.images || [],
      category: mockCategories.find((c) => c.id === formData.categoryId) || mockCategories[0],
      metadata: {},
      tags: [],
      createdAt: selectedProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? newProduct : p)));
    } else {
      setProducts([...products, newProduct]);
    }

    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Products">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCardSkeleton count={6} className="grid-cols-1" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Product</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Price</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Stock</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-neutral-800 hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-800 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-neutral-400">{product.category.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={product.type === 'digital' ? 'primary' : 'secondary'}>
                          {product.type === 'digital' ? (
                            <Download className="w-3 h-3 mr-1" />
                          ) : (
                            <Cuboid className="w-3 h-3 mr-1" />
                          )}
                          {capitalize(product.type)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && (
                            <span className="ml-2 text-sm text-neutral-500 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {product.type === 'digital' ? (
                          <span className="text-neutral-400">—</span>
                        ) : (
                          <span
                            className={
                              product.stock === 0
                                ? 'text-red-400'
                                : product.stock && product.stock < 5
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }
                          >
                            {product.stock} units
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={product.status === 'active' ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/products/${product.slug}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-slug"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-300 mb-1.5 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-1.5 block">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 h-10"
                >
                  <option value="digital">Digital</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-1.5 block">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 h-10"
                >
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-1.5 block">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })
                  }
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 h-10"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
              <Input
                label="Compare at Price"
                type="number"
                min="0"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={(e) =>
                  setFormData({ ...formData, compareAtPrice: Number(e.target.value) })
                }
              />
            </div>
            {formData.type === 'physical' && (
              <Input
                label="Stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            )}
            {formData.type === 'digital' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="File Size"
                  placeholder="e.g., 2.4 MB"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                />
                <Input
                  label="File Format"
                  placeholder="e.g., ZIP, PDF"
                  value={formData.fileFormat}
                  onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-neutral-400 my-4">
            Are you sure you want to delete &quot;{selectedProduct?.name}&quot;? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
