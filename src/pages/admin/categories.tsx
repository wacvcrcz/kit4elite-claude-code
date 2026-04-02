/**
 * Admin Categories Page
 * CRUD for product categories
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Folder,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/modal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types';

interface CategoryFormData {
  name: string;
  description: string;
  parentId: string | null;
}

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
  parentId: null,
};

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Digital Products', slug: 'digital-products', description: 'Downloadable digital goods', image: null, parentId: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Website Templates', slug: 'website-templates', description: 'Pre-built website templates', image: null, parentId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: 'Icon Sets', slug: 'icon-sets', description: 'Premium icon collections', image: null, parentId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', name: 'Physical Products', slug: 'physical-products', description: 'Physical merchandise', image: null, parentId: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '5', name: 'Merchandise', slug: 'merchandise', description: 'Branded merchandise', image: null, parentId: '4', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Build category tree
const buildCategoryTree = (cats: Category[]): Category[] => {
    const root = cats.filter((c) => !c.parentId);
    const getChildren = (parentId: string): Category[] =>
      cats.filter((c) => c.parentId === parentId).sort((a, b) => a.name.localeCompare(b.name));

    const build = (cat: Category, level: number): { cat: Category; level: number }[] => {
      const children = getChildren(cat.id);
      return [{ cat, level }, ...children.flatMap((child) => build(child, level + 1))];
    };

    return root
      .flatMap((cat) => build(cat, 0))
      .map(({ cat: _cat }) => _cat);
};

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...c, ...formData, updatedAt: new Date().toISOString() }
              : c
          )
        );
      } else {
        const newCategory: Category = {
          id: Math.random().toString(36).substr(2, 9),
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          ...formData,
          image: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCategories((prev) => [...prev, newCategory]);
      }

      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find((c) => c.id === parentId)?.name;
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Product Categories</h2>
            <p className="text-neutral-400">Organize your products with categories</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Folder className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-800">
              <AnimatePresence>
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Folder className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-neutral-400">
                          {getParentName(category.parentId) ? (
                            <>
                              <span className="text-neutral-500">Parent:</span>{' '}
                              {getParentName(category.parentId)}
                            </>
                          ) : (
                            'Root category'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredCategories.length === 0 && (
                <div className="p-8 text-center text-neutral-400">
                  No categories found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Parent Category
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value || null })
                }
                className="w-full h-10 px-3 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100"
              >
                <option value="">None (Root Category)</option>
                {categories
                  .filter((c) => c.id !== editingCategory?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {editingCategory ? 'Save Changes' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
