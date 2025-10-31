import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { ProductCard } from './ProductCard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

export function BuyerHome() {
  const { products, sellers, followedSellers, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  
  // Get category from URL params
  useEffect(() => {
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      } else {
        setSelectedCategory('all');
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);
  
  const trendingProducts = products.slice(0, 3);
  
  // Auto-rotate trending products
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTrendingIndex((prev) => (prev + 1) % trendingProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [trendingProducts.length]);
  
  return (
    <div className="min-h-screen bg-[#f4f0db]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content - Product Feed (Facebook Marketplace Grid) */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2>Marketplace</h2>
              <p className="text-muted-foreground">
                {selectedCategory === 'all'
                  ? 'Browse all products'
                  : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}
              </p>
            </div>
            
            {/* Mobile Trending Section - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm">🔥 Trending</h3>
                  <div className="flex gap-1">
                    {trendingProducts.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          index === currentTrendingIndex ? 'bg-primary w-4' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTrendingIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="cursor-pointer"
                    onClick={() => window.location.hash = `product/${trendingProducts[currentTrendingIndex]?.id}`}
                  >
                    {trendingProducts[currentTrendingIndex] && (
                      <div className="flex gap-3">
                        <img
                          src={trendingProducts[currentTrendingIndex].image}
                          alt={trendingProducts[currentTrendingIndex].titleBn}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm line-clamp-2 mb-2">
                            {trendingProducts[currentTrendingIndex].titleBn}
                          </h4>
                          <p className="text-primary">
                            ৳{trendingProducts[currentTrendingIndex].price}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Card>
            </div>
            
            {/* Product Grid - 4 columns desktop, 2 columns mobile */}
            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No products in this category
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Load More Button */}
            {filteredProducts.length > 8 && (
              <div className="mt-6 text-center">
                <Button variant="outline" className="w-full lg:w-auto">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
          
          {/* Right Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Trending Products Ad Card */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3>🔥 Trending</h3>
                <div className="flex gap-1">
                  {trendingProducts.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full transition-all ${
                        index === currentTrendingIndex ? 'bg-primary w-4' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrendingIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer"
                  onClick={() => window.location.hash = `product/${trendingProducts[currentTrendingIndex]?.id}`}
                >
                  {trendingProducts[currentTrendingIndex] && (
                    <>
                      <img
                        src={trendingProducts[currentTrendingIndex].image}
                        alt={trendingProducts[currentTrendingIndex].titleBn}
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                      <h4 className="line-clamp-2 mb-2">
                        {trendingProducts[currentTrendingIndex].titleBn}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-primary">
                          ৳{trendingProducts[currentTrendingIndex].price}
                        </p>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
            
            {/* Followed Sellers - Quick Link */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4>Followed Sellers</h4>
                {followedSellers.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.hash = 'followed-sellers'}
                  >
                    See All
                  </Button>
                )}
              </div>
              {followedSellers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No followed sellers yet
                </p>
              ) : (
                <div className="space-y-2">
                  {sellers
                    .filter((s) => followedSellers.includes(s.id))
                    .slice(0, 3)
                    .map((seller) => (
                      <button
                        key={seller.id}
                        className="w-full text-left p-2 rounded-xl hover:bg-accent transition-colors"
                        onClick={() => window.location.hash = `seller/${seller.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={seller.logo}
                            alt={seller.nameBn}
                            className="h-8 w-8 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{seller.nameBn}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  {followedSellers.length > 3 && (
                    <button
                      className="w-full text-left p-2 rounded-xl hover:bg-accent transition-colors text-sm text-primary"
                      onClick={() => window.location.hash = 'followed-sellers'}
                    >
                      + {followedSellers.length - 3} more
                    </button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}