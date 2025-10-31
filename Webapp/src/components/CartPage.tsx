import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';

export function CartPage() {
  const { cart, products, removeFromCart, updateCartQuantity, clearCart } = useStore();
  
  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  }).filter((item) => item.product);
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product!.price * item.quantity),
    0
  );
  
  const handleCheckout = () => {
    toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে! (ডেমো মোড)');
    clearCart();
    setTimeout(() => {
      window.location.hash = 'buyer';
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2>আপনার কার্ট</h2>
          {cart.length > 0 && (
            <Button variant="outline" onClick={clearCart}>
              সব সরান
            </Button>
          )}
        </div>
        
        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              🛒
            </div>
            <h3 className="mb-2">আপনার কার্ট খালি</h3>
            <p className="text-muted-foreground mb-6">
              প্রোডাক্ট যোগ করুন এবং কেনাকাটা শুরু করুন
            </p>
            <Button onClick={() => window.location.hash = 'buyer'}>
              প্রোডাক্ট দেখুন
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product!;
                
                return (
                  <Card key={item.productId} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.titleBn}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      
                      <div className="flex-1">
                        <h4 className="mb-1">{product.titleBn}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.title}
                        </p>
                        <p className="text-primary">৳{product.price} / yard</p>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-12 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="mt-2">
                          ৳{(product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="mb-6">অর্ডার সারাংশ</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">সাবটোটাল</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ডেলিভারি</span>
                    <span className="text-accent">নিয়োগযোগ্য</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between">
                    <span>মোট</span>
                    <span className="text-primary">৳{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleCheckout}>
                  চেকআউট
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  * এটি একটি ডেমো। প্রকৃত পেমেন্ট প্রসেস হবে না।
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
