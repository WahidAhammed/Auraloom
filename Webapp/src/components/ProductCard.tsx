import { useStore, Product } from '../lib/store';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user, sellers } = useStore();
  
  const seller = sellers.find((s) => s.id === product.sellerId);
  
  const handleViewProduct = () => {
    if (user?.mode === 'guest') {
      window.location.hash = 'subscription';
      return;
    }
    window.location.hash = `product/${product.id}`;
  };
  
  const handleContactSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.mode === 'guest') {
      window.location.hash = 'subscription';
      return;
    }
    window.location.hash = `messages?seller=${product.sellerId}&product=${product.id}`;
  };
  
  const handleViewSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.mode === 'guest') {
      window.location.hash = 'subscription';
      return;
    }
    window.location.hash = `seller/${product.sellerId}`;
  };
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
      onClick={handleViewProduct}
    >
      {/* Image with MOQ Badge */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.titleBn}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* MOQ Badge - Top Left */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-black/70 text-white border-0 backdrop-blur-sm"
        >
          MOQ: {product.moq}
        </Badge>
      </div>
      
      {/* Product Info - Facebook Marketplace Style */}
      <div className="p-3 space-y-1">
        {/* Price */}
        <p className="text-primary">৳{product.price}</p>
        
        {/* Product Name */}
        <h4 className="line-clamp-2 text-gray-900">
          {product.titleBn}
        </h4>
        
        {/* Shop Name */}
        <button 
          className="text-sm text-gray-600 hover:text-primary transition-colors hover:underline"
          onClick={handleViewSeller}
        >
          {seller?.nameBn}
        </button>
      </div>
    </div>
  );
}
