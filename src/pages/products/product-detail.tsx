import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Cuboid,
  Download,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductStore } from '@/store/product-store';
import { useCartStore } from '@/store/cart-store';
import { ProductDetailSkeleton } from '@/components/products/product-skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Product } from '@/types';

/**
 * Image Gallery Component
 */
function ImageGallery({ product }: { product: Product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product.images;

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-800 rounded-xl flex items-center justify-center">
        <span className="text-neutral-500">No images</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt || product.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-neutral-600'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Stock Status Badge
 */
function StockStatus({ product }: { product: Product }) {
  if (product.type === 'digital') {
    return (
      <Badge variant="success" dot dotColor="bg-emerald-500">
        Instant Download
      </Badge>
    );
  }

  const stock = product.stock ?? 0;

  if (stock === 0) {
    return (
      <Badge variant="ghost" className="text-neutral-500">
        Out of Stock
      </Badge>
    );
  }

  if (stock <= 5) {
    return (
      <Badge variant="warning" dot dotColor="bg-amber-500">
        Only {stock} left
      </Badge>
    );
  }

  return (
    <Badge variant="success" dot dotColor="bg-emerald-500">
      In Stock ({stock} available)
    </Badge>
  );
}

/**
 * Product Info Section
 */
function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const isInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  );

  const isDigital = product.type === 'digital';
  const maxStock = isDigital ? 99 : product.stock ?? 1;
  const canPurchase = isDigital || (product.stock ?? 0) > 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: null,
      product,
      variant: null,
      quantity,
    });
  };

  return (
    <div className="space-y-6">
      {/* Category & Type */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" size="sm">
          {product.category.name}
        </Badge>
        <Badge
          variant={isDigital ? 'primary' : 'secondary'}
          size="sm"
          className="flex items-center gap-1"
        >
          {isDigital ? <Download className="w-3 h-3" /> : <Cuboid className="w-3 h-3" />}
          {isDigital ? 'Digital' : 'Physical'}
        </Badge>
      </div>

      {/* Name */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
          {product.name}
        </h1>
        {/* Reviews Placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-amber-400 fill-amber-400"
              />
            ))}
          </div>
          <span className="text-sm text-neutral-400">(12 reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-semibold">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-xl text-neutral-500 line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {product.compareAtPrice && (
          <Badge variant="error">
            {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* Description */}
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-neutral-300 leading-relaxed">{product.description}</p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <StockStatus product={product} />
      </div>

      {/* Digital Product Info */}
      {isDigital && (
        <div className="bg-primary-900/20 border border-primary-800 rounded-xl p-4">
          <h4 className="font-display font-medium text-primary-400 mb-2">
            Digital Download
          </h4>
          <ul className="text-sm text-primary-300 space-y-1">
            {product.fileSize && <li>File size: {product.fileSize}</li>}
            {product.fileFormat && <li>Format: {product.fileFormat}</li>}
            <li>Lifetime access</li>
          </ul>
        </div>
      )}

      {/* Physical Product Info */}
      {!isDigital && product.dimensions && (
        <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
          <h4 className="font-display font-medium mb-2">Dimensions</h4>
          <p className="text-sm text-neutral-400">
            {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
          </p>
          {product.weight && (
            <p className="text-sm text-neutral-400 mt-1">Weight: {product.weight}g</p>
          )}
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4">
        {!isDigital && (
          <div className="flex items-center border border-neutral-700 rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canPurchase}
          onClick={handleAddToCart}
          loading={isInCart}
        >
          {canPurchase ? (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          Wishlist
        </Button>
        <Button variant="secondary" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Metadata */}
      <div className="text-sm text-neutral-500 pt-4 border-t border-neutral-800">
        <p>Added: {formatDate(product.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p className="mt-1">SKU: {product.id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  );
}

/**
 * Product Detail Page
 */
export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, fetchProductBySlug, clearError } =
    useProductStore();

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug);
    }
  }, [slug, fetchProductBySlug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Breadcrumb / Back */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <ProductDetailSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-error mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => clearError()} variant="secondary">
                Clear Error
              </Button>
              <Button onClick={() => slug && fetchProductBySlug(slug)}>
                Retry
              </Button>
            </div>
          </div>
        ) : !currentProduct ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 mb-4">Product not found</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <ImageGallery product={currentProduct} />

            {/* Product Info */}
            <ProductInfo product={currentProduct} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
