import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ProductCard } from './ProductCard';
import { Product } from '../lib/store';

interface ProductRailProps {
  title: string;
  titleBn?: string;
  products: Product[];
  showViewAll?: boolean;
  onViewAll?: () => void;
  visibleCards?: number;
}

export function ProductRail({
  title,
  titleBn,
  products,
  showViewAll = false,
  onViewAll,
  visibleCards = 3,
}: ProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (products.length === 0) return null;
  
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2>{title}</h2>
          {titleBn && <p className="text-muted-foreground">{titleBn}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          {showViewAll && (
            <Button variant="outline" onClick={onViewAll}>
              View All
            </Button>
          )}
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
