import { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus, Package, Radio, BarChart3, Edit, Trash2 } from 'lucide-react';
import { CreateBroadcastModal } from './CreateBroadcastModal';
import { CreateProductModal } from './CreateProductModal';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

export function SellerDashboard() {
  const { user, products, broadcasts, sellers } = useStore();
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const seller = sellers.find((s) => s.id === user?.id);
  const myProducts = products.filter((p) => p.sellerId === user?.id);
  const myBroadcasts = broadcasts.filter((b) => b.sellerId === user?.id);
  
  const isFree = user?.membership !== 'premium';
  const productLimitReached = isFree && myProducts.length >= 2;
  const broadcastLimitReached = isFree && myBroadcasts.length >= 2;
  
  const totalViews = seller?.followers || 0;
  const totalProducts = myProducts.length;
  const totalBroadcasts = myBroadcasts.length;
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="mb-2">সেলার ড্যাশবোর্ড</h2>
            <p className="text-muted-foreground">
              আপনার দোকান পরিচালনা করুন
            </p>
          </div>
          
          <Badge variant={isFree ? 'secondary' : 'default'}>
            {isFree ? 'ফ্রি অ্যাকাউন্ট' : 'প্রিমিয়াম অ্যাকাউন্ট'}
          </Badge>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">ফলোয়ার</p>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2>{seller?.followers || 0}</h2>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">প্রোডাক্ট</p>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2>
              {totalProducts}
              {isFree && <span className="text-muted-foreground">/2</span>}
            </h2>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">ব্রডকাস্ট</p>
              <Radio className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2>
              {totalBroadcasts}
              {isFree && <span className="text-muted-foreground">/2</span>}
            </h2>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground">মোট ভিউ</p>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2>{(totalViews * 15).toLocaleString()}</h2>
          </Card>
        </div>
        
        {isFree && (
          <Alert className="mb-6">
            <AlertDescription>
              ফ্রি অ্যাকাউন্টে সর্বোচ্চ ২টি প্রোডাক্ট এবং ২টি ব্রডকাস্ট পোস্ট করতে পারবেন।{' '}
              <button
                className="underline text-primary"
                onClick={() => window.location.hash = 'subscription'}
              >
                প্রিমিয়াম নিন
              </button>{' '}
              সীমাহীন অ্যাক্সেসের জন্য।
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Products Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>আমার প্রোডাক্ট</h3>
              <Button
                onClick={() => {
                  if (productLimitReached) {
                    window.location.hash = 'subscription';
                  } else {
                    setShowProductModal(true);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                নতুন প্রোডাক্ট
              </Button>
            </div>
            
            {myProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>এখনো কোনো প্রোডাক্ট যোগ করা হয়নি</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 bg-accent/50 rounded-xl"
                  >
                    <img
                      src={product.image}
                      alt={product.titleBn}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4>{product.titleBn}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.title}
                      </p>
                      <p className="text-primary">৳{product.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {/* Broadcast Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>আমার ব্রডকাস্ট</h3>
              <Button
                onClick={() => {
                  if (broadcastLimitReached) {
                    window.location.hash = 'subscription';
                  } else {
                    setShowBroadcastModal(true);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                নতুন ব্রডকাস্ট
              </Button>
            </div>
            
            {myBroadcasts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>এখনো কোনো ব্রডকাস্ট পোস্ট করা হয়নি</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBroadcasts.map((broadcast) => (
                  <div
                    key={broadcast.id}
                    className="p-4 bg-accent/50 rounded-xl"
                  >
                    <p className="mb-2">{broadcast.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(broadcast.timestamp).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <CreateBroadcastModal
        open={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
      />
      
      <CreateProductModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
      />
    </div>
  );
}
