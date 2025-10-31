import { useStore } from '../lib/store';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserCheck, Store } from 'lucide-react';

export function FollowedSellersPage() {
  const { sellers, followedSellers, unfollowSeller, products } = useStore();
  
  const followedSellersList = sellers.filter((s) => followedSellers.includes(s.id));
  
  return (
    <div className="min-h-screen bg-[#f4f0db] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="mb-2">ফলো করা সেলার</h2>
          <p className="text-muted-foreground">
            আপনার ফলো করা সকল সেলারদের তালিকা
          </p>
        </div>
        
        {followedSellersList.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">কোনো সেলার ফলো করা হয়নি</h3>
            <p className="text-muted-foreground mb-6">
              সেলার ফলো করুন তাদের সর্বশেষ পণ্য এবং ব্রডকাস্ট দেখতে
            </p>
            <Button onClick={() => window.location.hash = 'buyer'}>
              প্রোডাক্ট দেখুন
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedSellersList.map((seller) => {
              const sellerProducts = products.filter((p) => p.sellerId === seller.id);
              
              return (
                <Card key={seller.id} className="bg-white overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Banner */}
                  {seller.banner && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={seller.banner}
                        alt={seller.nameBn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Profile */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={seller.logo}
                          alt={seller.nameBn}
                          className="h-16 w-16 rounded-full border-4 border-white -mt-10"
                        />
                        {seller.verified && (
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 mt-2">
                        <h3 className="truncate mb-1">{seller.nameBn}</h3>
                        <p className="text-sm text-muted-foreground truncate">{seller.name}</p>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    {seller.categories && seller.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {seller.categories.slice(0, 3).map((cat) => (
                          <span key={cat} className="text-xs bg-accent px-3 py-1 rounded-full capitalize">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {seller.descriptionBn}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4" />
                        {seller.followers.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Store className="h-4 w-4" />
                        {sellerProducts.length} পণ্য
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.location.hash = `seller/${seller.id}`}
                      >
                        দোকান দেখুন
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => unfollowSeller(seller.id)}
                      >
                        আনফলো
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
