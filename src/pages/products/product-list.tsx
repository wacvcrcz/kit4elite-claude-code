import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Cuboid,
  Download,
  X,
  ShoppingBag,
  Grid3X3,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useProductStore } from '@/store/product-store';
import {
  ProductCardSkeleton,
  CategoryFilterSkeleton,
  ResultsHeaderSkeleton,
} from '@/components/products/product-skeleton';
import { formatPrice } from '@/lib/utils';
import type { Category, Product, ProductType, ProductFilter } from '@/types';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
] as const;

/**
 * Shopify-style Product Card
 */
function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images[0]?.url || '/placeholder-product.png';
  const isDigital = product.type === 'digital';
  const inStock = product.stock === null || product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card variant="ghost" className="h-full flex flex-col overflow-hidden">
        {/* Image Container - Shopify style square with hover overlay */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={primaryImage}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Hover overlay with quick actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={isDigital ? 'primary' : 'secondary'} size="sm" className="rounded-full">
              {isDigital ? (
                <><Download className="w-3 h-3 mr-1" /> Digital</>
              ) : (
                <><Cuboid className="w-3 h-3 mr-1" /> Physical</>
              )}
            </Badge>
          </div>

          {/* Out of Stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
              <Badge variant="ghost" size="lg" className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full px-4">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content - Clean Shopify style */}
        <CardContent className="p-4 flex flex-col">
          {/* Category */}
          <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
            {product.category?.name || 'Product'}
          </span>

          {/* Title */}
          <h3 className="font-sans text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="font-sans text-sm font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-neutral-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Category Filter Component - Sidebar style
 */
function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: Category[];
  selectedCategory: string | undefined;
  onSelect: (categoryId: string | undefined) => void;
}) {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-2">
      <h4 className="font-sans font-medium mb-3">Categories</h4>
      <div className="space-y-1">
        <button
          onClick={() => onSelect(undefined)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            !selectedCategory
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          All Categories
        </button>
        {safeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Product Type Filter
 */
function TypeFilter({
  selectedType,
  onSelect,
}: {
  selectedType: ProductType | undefined;
  onSelect: (type: ProductType | undefined) => void;
}) {
  return (
    <div className="space-y-2">
      <h4 className="font-sans font-medium mb-3">Product Type</h4>
      <div className="space-y-1">
        <button
          onClick={() => onSelect(undefined)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            !selectedType
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => onSelect('physical')}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
            selectedType === 'physical'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <Cuboid className="w-4 h-4" /> Physical Products
        </button>
        <button
          onClick={() => onSelect('digital')}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
            selectedType === 'digital'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <Download className="w-4 h-4" /> Digital Products
        </button>
      </div>
    </div>
  );
}

/**
 * Price Range Filter - Shopify style
 */
function PriceFilter({
  minPrice,
  maxPrice,
  onApply,
}: {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onApply: (min?: number, max?: number) => void;
}) {
  const [localMin, setLocalMin] = useState(minPrice?.toString() || '');
  const [localMax, setLocalMax] = useState(maxPrice?.toString() || '');

  return (
    <div className="space-y-3">
      <h4 className="font-sans font-medium mb-3">Price</h4>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
          <Input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="pl-6 h-9"
          />
        </div>
        <span className="text-neutral-400">-</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
          <Input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="pl-6 h-9"
          />
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() =>
          onApply(
            localMin ? parseFloat(localMin) * 100 : undefined,
            localMax ? parseFloat(localMax) * 100 : undefined
          )
        }
      >
        Apply
      </Button>
    </div>
  );
}

/**
 * Active Filters - Shopify style pills
 */
function ActiveFilters({
  filter,
  categories,
  onClear,
  onClearAll,
}: {
  filter: ProductFilter;
  categories: Category[];
  onClear: (key: keyof ProductFilter) => void;
  onClearAll: () => void;
}) {
  const active: { key: keyof ProductFilter; label: string }[] = [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  if (filter.category) {
    const category = safeCategories.find((c) => c.id === filter.category);
    if (category) active.push({ key: 'category', label: category.name });
  }
  if (filter.type) {
    active.push({ key: 'type', label: filter.type === 'digital' ? 'Digital' : 'Physical' });
  }
  if (filter.minPrice !== undefined) {
    active.push({ key: 'minPrice', label: `Min $${(filter.minPrice / 100).toFixed(0)}` });
  }
  if (filter.maxPrice !== undefined) {
    active.push({ key: 'maxPrice', label: `Max $${(filter.maxPrice / 100).toFixed(0)}` });
  }

  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {active.map((item) => (
        <Badge
          key={item.key}
          variant="secondary"
          className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
          onClick={() => onClear(item.key)}
        >
          {item.label}
          <X className="w-3 h-3 ml-1" />
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
      >
        Clear all
      </button>
    </div>
  );
}

/**
 * Main Product List Page - Shopify style
 */
export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');

  const {
    products,
    categories,
    filter,
    pagination,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    setFilter,
    clearFilter,
  } = useProductStore();

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Initialize from URL params
  useEffect(() => {
    const initialFilter: ProductFilter = {};
    const category = searchParams.get('category');
    const type = searchParams.get('type') as ProductType | null;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') as ProductFilter['sortBy'];

    if (category) initialFilter.category = category;
    if (type && ['digital', 'physical'].includes(type)) initialFilter.type = type;
    if (minPrice) initialFilter.minPrice = parseFloat(minPrice);
    if (maxPrice) initialFilter.maxPrice = parseFloat(maxPrice);
    if (search) {
      initialFilter.search = search;
      setSearchQuery(search);
    }
    if (sortBy) initialFilter.sortBy = sortBy;

    setFilter(initialFilter);
    fetchCategories();
  }, []);

  // Fetch products when filter changes
  useEffect(() => {
    fetchProducts(1, filter);
  }, [filter]);

  // Update URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.category) params.set('category', filter.category);
    if (filter.type) params.set('type', filter.type);
    if (filter.minPrice !== undefined) params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) params.set('maxPrice', filter.maxPrice.toString());
    if (filter.search) params.set('search', filter.search);
    if (filter.sortBy) params.set('sortBy', filter.sortBy);

    setSearchParams(params, { replace: true });
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ search: searchQuery });
  };

  const handleFilterChange = useCallback(
    (newFilter: Partial<ProductFilter>) => {
      setFilter(newFilter);
    },
    [setFilter]
  );

  const handleClearFilter = (key: keyof ProductFilter) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    clearFilter();
    setFilter(newFilter);
  };

  const currentSort = sortOptions.find((o) => o.value === filter.sortBy) || sortOptions[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Header Section - Shopify style */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-sans text-4xl font-bold mb-4">Products</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 rounded-full"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {isLoading ? (
            <ResultsHeaderSkeleton />
          ) : (
            <>
              <p className="text-neutral-600 dark:text-neutral-400">
                {pagination?.total || products.length} products
              </p>
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <Button
                  variant={gridView === 'grid' ? 'primary' : 'ghost'}
                  size="icon"
                  onClick={() => setGridView('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={gridView === 'list' ? 'primary' : 'ghost'}
                  size="icon"
                  onClick={() => setGridView('list')}
                >
                  <List className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="flex items-center gap-2 min-w-[160px]">
                      Sort: {currentSort.label}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setFilter({ sortBy: option.value })}
                        className={filter.sortBy === option.value ? 'bg-primary-500/20' : ''}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        {/* Active Filters */}
        {isLoading ? null : (
          <ActiveFilters
            filter={filter}
            categories={safeCategories}
            onClear={handleClearFilter}
            onClearAll={clearFilter}
          />
        )}

        {/* Content Grid */}
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card variant="ghost" className="sticky top-24">
              <CardContent className="p-4 space-y-6">
                {isLoading ? (
                  <CategoryFilterSkeleton />
                ) : (
                  <>
                    <CategoryFilter
                      categories={safeCategories}
                      selectedCategory={filter.category}
                      onSelect={(cat) => handleFilterChange({ category: cat })}
                    />
                    <hr className="border-neutral-200 dark:border-neutral-800" />
                    <TypeFilter
                      selectedType={filter.type}
                      onSelect={(type) => handleFilterChange({ type })}
                    />
                    <hr className="border-neutral-200 dark:border-neutral-800" />
                    <PriceFilter
                      minPrice={filter.minPrice}
                      maxPrice={filter.maxPrice}
                      onApply={(min, max) =>
                        handleFilterChange({ minPrice: min, maxPrice: max })
                      }
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 lg:hidden p-4 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sans text-xl font-bold">Filters</h2>
                  <Button variant="ghost" onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-6">
                  <CategoryFilter
                    categories={safeCategories}
                    selectedCategory={filter.category}
                    onSelect={(cat) => {
                      handleFilterChange({ category: cat });
                      setMobileFiltersOpen(false);
                    }}
                  />
                  <hr className="border-neutral-200 dark:border-neutral-800" />
                  <TypeFilter
                    selectedType={filter.type}
                    onSelect={(type) => {
                      handleFilterChange({ type });
                      setMobileFiltersOpen(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={gridView === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-error mb-4">{error}</p>
                <Button onClick={() => fetchProducts()}>Try Again</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">No products found</p>
                <Button onClick={clearFilter}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                className={gridView === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
                }
                layout
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => fetchProducts(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={!pagination.hasNextPage}
                  onClick={() => fetchProducts(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
