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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
 * Product Card Component
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
    >
      <Card interactive className="group h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-800">
          <img
            src={primaryImage}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={isDigital ? 'primary' : 'secondary'}
              size="sm"
              className="flex items-center gap-1"
            >
              {isDigital ? (
                <Download className="w-3 h-3" />
              ) : (
                <Cuboid className="w-3 h-3" />
              )}
              {isDigital ? 'Digital' : 'Physical'}
            </Badge>
          </div>
          {/* Stock Badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="ghost" size="lg" className="bg-black/50 text-white">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 flex flex-col">
          {/* Category */}
          <span className="text-xs text-primary-400 font-medium mb-1">
            {product.category.name}
          </span>

          {/* Title */}
          <h3 className="font-display text-lg font-medium line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <div>
              <span className="font-display text-xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="ml-2 text-sm text-neutral-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {/* Add to cart logic in Phase 5 */}}
              disabled={!inStock}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Category Filter Component
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
  return (
    <div className="space-y-2">
      <h4 className="font-display font-medium mb-3">Categories</h4>
      <div className="space-y-1">
        <button
          onClick={() => onSelect(undefined)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            !selectedCategory
              ? 'bg-primary-500/20 text-primary-400'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-500/20 text-primary-400'
                : 'hover:bg-neutral-800 text-neutral-300'
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
      <h4 className="font-display font-medium mb-3">Product Type</h4>
      <div className="space-y-1">
        <button
          onClick={() => onSelect(undefined)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            !selectedType
              ? 'bg-primary-500/20 text-primary-400'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => onSelect('physical')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            selectedType === 'physical'
              ? 'bg-primary-500/20 text-primary-400'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <Cuboid className="w-4 h-4" />
          Physical Products
        </button>
        <button
          onClick={() => onSelect('digital')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            selectedType === 'digital'
              ? 'bg-primary-500/20 text-primary-400'
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <Download className="w-4 h-4" />
          Digital Products
        </button>
      </div>
    </div>
  );
}

/**
 * Price Range Filter
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
      <h4 className="font-display font-medium mb-3">Price Range</h4>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="h-9"
        />
        <Input
          type="number"
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="h-9"
        />
      </div>
      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() =>
          onApply(
            localMin ? parseFloat(localMin) : undefined,
            localMax ? parseFloat(localMax) : undefined
          )
        }
      >
        Apply
      </Button>
    </div>
  );
}

/**
 * Active Filters
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

  if (filter.category) {
    const category = categories.find((c) => c.id === filter.category);
    if (category) active.push({ key: 'category', label: category.name });
  }
  if (filter.type) {
    active.push({ key: 'type', label: filter.type === 'digital' ? 'Digital' : 'Physical' });
  }
  if (filter.minPrice !== undefined) {
    active.push({ key: 'minPrice', label: `Min $${filter.minPrice}` });
  }
  if (filter.maxPrice !== undefined) {
    active.push({ key: 'maxPrice', label: `Max $${filter.maxPrice}` });
  }

  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-neutral-400">Active filters:</span>
      {active.map((item) => (
        <Badge
          key={item.key}
          variant="secondary"
          className="cursor-pointer hover:bg-neutral-700"
          onClick={() => onClear(item.key)}
        >
          {item.label}
          <X className="w-3 h-3 ml-1" />
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-primary-400 hover:text-primary-300 ml-2"
      >
        Clear all
      </button>
    </div>
  );
}

/**
 * Main Product List Page
 */
export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
      {/* Header Section */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Products</h1>
          <p className="text-neutral-400 max-w-xl">
            Browse our collection of premium digital and physical products
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {filter.category && <Badge size="sm" className="ml-2">1</Badge>}
          </Button>
        </div>

        {/* Results & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {isLoading ? (
            <ResultsHeaderSkeleton />
          ) : (
            <>
              <p className="text-neutral-400">
                {pagination?.total || products.length} products
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="flex items-center gap-2">
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
            </>
          )}
        </div>

        {/* Active Filters */}
        {isLoading ? null : (
          <ActiveFilters
            filter={filter}
            categories={categories}
            onClear={handleClearFilter}
            onClearAll={clearFilter}
          />
        )}

        {/* Content Grid */}
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-4">
              <CardContent>
                {isLoading ? (
                  <CategoryFilterSkeleton />
                ) : (
                  <div className="space-y-6">
                    <CategoryFilter
                      categories={categories}
                      selectedCategory={filter.category}
                      onSelect={(cat) => handleFilterChange({ category: cat })}
                    />
                    <hr className="border-neutral-800" />
                    <TypeFilter
                      selectedType={filter.type}
                      onSelect={(type) => handleFilterChange({ type })}
                    />
                    <hr className="border-neutral-800" />
                    <PriceFilter
                      minPrice={filter.minPrice}
                      maxPrice={filter.maxPrice}
                      onApply={(min, max) =>
                        handleFilterChange({ minPrice: min, maxPrice: max })
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="fixed inset-y-0 left-0 w-80 bg-neutral-900 border-r border-neutral-800 z-50 lg:hidden p-4 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-6">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={filter.category}
                    onSelect={(cat) => {
                      handleFilterChange({ category: cat });
                      setMobileFiltersOpen(false);
                    }}
                  />
                  <hr className="border-neutral-800" />
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
              <ProductCardSkeleton count={12} />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-error mb-4">{error}</p>
                <Button onClick={() => fetchProducts()}>Try Again</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400 mb-4">No products found</p>
                <Button onClick={clearFilter}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
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
                <span className="text-neutral-400">
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
