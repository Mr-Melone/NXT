/**
 * Central product image registry.
 * All product images are managed here in one place — add or update
 * image URLs by product name. The UI pulls from this map via
 * getProductImages(product) and falls back to any DB-stored images.
 */

const PRODUCT_IMAGES = {
  'NXT GHOST': [
    'https://media.base44.com/images/public/6a2a50c262ff0a991aaa0504/fe6c134f9_ChatGPT_Image_Jul_2__2026__04_17_53_PM.png',
  ],
  'NXT CORE': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  ],
  'NXT VENOM': [
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  ],
};

/**
 * Returns the image array for a product, checking the local
 * registry first and falling back to product.images from the DB.
 */
export function getProductImages(product) {
  if (!product) return [];
  const fromRegistry = PRODUCT_IMAGES[product.name];
  if (fromRegistry && fromRegistry.length > 0) return fromRegistry;
  return product.images || [];
}
