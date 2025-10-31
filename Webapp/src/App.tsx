import { useEffect, useState } from 'react';
import { useStore } from './lib/store';
import { mockProducts, mockSellers, mockBroadcasts, mockBroadcastChannels } from './lib/mockData';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { BuyerHome } from './components/BuyerHome';
import { SellerDashboard } from './components/SellerDashboard';
import { MembershipPage } from './components/MembershipPage';
import { BuyerBroadcastPage } from './components/BuyerBroadcastPage';
import { SellerBroadcastPage } from './components/SellerBroadcastPage';
import { MessagingPage } from './components/MessagingPage';
import { CartPage } from './components/CartPage';
import { NotificationsPage } from './components/NotificationsPage';
import { FollowedSellersPage } from './components/FollowedSellersPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { user, products, sellers, broadcasts, broadcastChannels, setProducts, setSellers, setBroadcasts, setBroadcastChannels } = useStore();
  const [currentPage, setCurrentPage] = useState('');
  
  // Initialize mock data
  useEffect(() => {
    if (products.length === 0) {
      setProducts(mockProducts);
    }
    if (sellers.length === 0) {
      setSellers(mockSellers);
    }
    if (broadcasts.length === 0) {
      setBroadcasts(mockBroadcasts);
    }
    if (broadcastChannels.length === 0) {
      setBroadcastChannels(mockBroadcastChannels);
    }
  }, []);
  
  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentPage(hash);
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const renderPage = () => {
    // Login page
    if (currentPage === 'login') {
      return <LoginPage />;
    }
    
    // Subscription page (accessible to all)
    if (currentPage === 'subscription') {
      return <MembershipPage />;
    }
    
    // Landing page (Guest mode)
    if (!currentPage || currentPage === '' || user?.mode === 'guest') {
      return <LandingPage />;
    }
    
    // Buyer mode pages
    if (user?.mode === 'buyer') {
      if (currentPage === 'buyer' || currentPage === '') {
        return <BuyerHome />;
      }
      if (currentPage === 'broadcasts' || currentPage.startsWith('buyer/broadcasts')) {
        return <BuyerBroadcastPage />;
      }
      if (currentPage === 'followed-sellers') {
        return <FollowedSellersPage />;
      }
      if (currentPage === 'messages' || currentPage.startsWith('messages')) {
        return <MessagingPage />;
      }
      if (currentPage === 'cart') {
        return <CartPage />;
      }
      if (currentPage === 'notifications') {
        return <NotificationsPage />;
      }
      if (currentPage === 'subscription') {
        return <MembershipPage />;
      }
      if (currentPage.startsWith('seller/')) {
        const sellerId = currentPage.split('/')[1];
        return <SellerProfile sellerId={sellerId} />;
      }
      if (currentPage.startsWith('product/')) {
        const productId = currentPage.split('/')[1];
        return <ProductDetail productId={productId} />;
      }
      if (currentPage === 'profile' || currentPage === 'orders') {
        return <ProfilePage />;
      }
      return <BuyerHome />;
    }
    
    // Seller mode pages
    if (user?.mode === 'seller') {
      if (currentPage === 'seller/broadcasts') {
        return <SellerBroadcastPage />;
      }
      if (currentPage === 'seller' || currentPage === '' || currentPage.startsWith('seller/')) {
        return <SellerDashboard />;
      }
      if (currentPage === 'messages' || currentPage.startsWith('messages')) {
        return <MessagingPage />;
      }
      if (currentPage === 'profile') {
        return <ProfilePage />;
      }
      return <SellerDashboard />;
    }
    
    return <LandingPage />;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{renderPage()}</main>
      <Toaster />
    </div>
  );
}

// Simple seller profile component
function SellerProfile({ sellerId }: { sellerId: string }) {
  const { sellers, products, followedSellers, followSeller, unfollowSeller, user } = useStore();
  
  const seller = sellers.find((s) => s.id === sellerId);
  const sellerProducts = products.filter((p) => p.sellerId === sellerId);
  const isFollowing = followedSellers.includes(sellerId);
  
  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Seller not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        {seller.banner && (
          <div className="h-48 rounded-2xl overflow-hidden mb-6">
            <img
              src={seller.banner}
              alt={seller.nameBn}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="bg-card rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={seller.logo}
                alt={seller.nameBn}
                className="h-24 w-24 rounded-full border-4 border-white"
              />
              {seller.verified && (
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1>{seller.nameBn}</h1>
                {seller.verified && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{seller.name}</p>
              <p className="mb-4">{seller.descriptionBn}</p>
              
              {seller.categories && seller.categories.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {seller.categories.map((cat) => (
                    <span key={cat} className="text-xs bg-accent px-3 py-1 rounded-full capitalize">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                <span>{seller.followers.toLocaleString()} Followers</span>
                <span>{sellerProducts.length} Products</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  className={`px-6 py-2 rounded-full transition-colors ${
                    isFollowing
                      ? 'bg-accent text-foreground'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  onClick={() =>
                    isFollowing ? unfollowSeller(sellerId) : followSeller(sellerId)
                  }
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  className="px-6 py-2 rounded-full bg-accent hover:bg-accent/80 transition-colors"
                  onClick={() => window.location.hash = `messages?seller=${sellerId}`}
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="mb-6">প্রোডাক্ট ({sellerProducts.length})</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {sellerProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => window.location.hash = `product/${product.id}`}
            >
              <img
                src={product.image}
                alt={product.titleBn}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="mb-2">{product.titleBn}</h4>
                <p className="text-primary">৳{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple product detail component
function ProductDetail({ productId }: { productId: string }) {
  const { products, sellers, addToCart, user } = useStore();
  const product = products.find((p) => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }
  
  const seller = sellers.find((s) => s.id === product.sellerId);
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.titleBn}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </div>
          
          <div>
            <h1 className="mb-2">{product.titleBn}</h1>
            <p className="text-muted-foreground mb-6">{product.title}</p>
            
            <div className="bg-accent/50 rounded-2xl p-6 mb-6">
              <p className="text-3xl text-primary mb-2">৳{product.price}</p>
              <p className="text-sm text-muted-foreground">per yard</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm text-muted-foreground">Blend/Composition</p>
                <p>{product.blend}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Minimum Order Quantity</p>
                <p>{product.moq}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="capitalize">{product.category}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="mb-2">{product.descriptionBn}</p>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="flex gap-4 mb-8">
              <button
                className="flex-1 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
                onClick={() => {
                  if (user?.mode === 'guest') {
                    window.location.hash = 'login';
                    return;
                  }
                  addToCart(product.id, 1);
                }}
              >
                Add to Cart
              </button>
              <button
                className="flex-1 bg-accent px-6 py-3 rounded-full hover:bg-accent/80 transition-colors"
                onClick={() => {
                  if (user?.mode === 'guest') {
                    window.location.hash = 'login';
                    return;
                  }
                  window.location.hash = `messages?seller=${product.sellerId}&product=${product.id}`;
                }}
              >
                Contact Seller
              </button>
            </div>
            
            {seller && (
              <div
                className="bg-card rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => window.location.hash = `seller/${seller.id}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={seller.logo}
                    alt={seller.nameBn}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4>{seller.nameBn}</h4>
                    <p className="text-sm text-muted-foreground">{seller.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple profile page component
function ProfilePage() {
  const { user } = useStore();
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-2xl p-8">
          <h2 className="mb-6">আমার প্রোফাই</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Type</p>
              <p className="capitalize">{user?.mode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Membership</p>
              <p className="capitalize">{user?.membership}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}