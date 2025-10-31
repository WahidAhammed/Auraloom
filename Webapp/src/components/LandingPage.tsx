import { HeroCarousel } from './HeroCarousel';
import { ProductRail } from './ProductRail';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useStore } from '../lib/store';
import { Search, Link as LinkIcon, CheckCircle, Radio } from 'lucide-react';

const whyJoinFeatures = [
  {
    icon: Search,
    title: 'Discover',
    titleBn: 'আবিষ্কার করুন',
    description: 'Find verified suppliers',
    descriptionBn: 'যাচাইকৃত সরবরাহকারী খুঁজুন',
  },
  {
    icon: LinkIcon,
    title: 'Connect',
    titleBn: 'সংযুক্ত হন',
    description: 'Direct link to sellers',
    descriptionBn: 'সেলারদের সাথে সরাসরি যোগাযোগ',
  },
  {
    icon: CheckCircle,
    title: 'Verified',
    titleBn: 'যাচাইকৃত',
    description: 'Trusted marketplace',
    descriptionBn: 'বিশ্বস্ত মার্কেটপ্লেস',
  },
  {
    icon: Radio,
    title: 'Broadcast',
    titleBn: 'ব্রডকাস্ট',
    description: 'Industry updates daily',
    descriptionBn: 'প্রতিদিন শিল্পের আপডেট',
  },
];

export function LandingPage() {
  const { products } = useStore();
  
  const productPreviews = products.slice(0, 6);
  const trendingProducts = products.slice(0, 4);
  const auraloomProducts = products.slice(4, 9);
  
  const handleViewAll = () => {
    window.location.hash = 'login';
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel */}
      <HeroCarousel />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Product Previews */}
        <ProductRail
          title="Featured Products"
          titleBn="বৈশিষ্ট্যযুক্ত প্রোডাক্ট"
          products={productPreviews}
          showViewAll
          onViewAll={handleViewAll}
          visibleCards={3}
        />
        
        {/* Why Join Auraloom - Bigger */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h1 className="mb-4">Why Join Auraloom</h1>
            <p className="text-muted-foreground">কেন Auraloom এ যোগ দেবেন</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {whyJoinFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 text-center hover:shadow-xl transition-all hover:scale-105">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="mb-3">{feature.title}</h2>
                  <p className="text-muted-foreground mb-3">{feature.titleBn}</p>
                  <p>{feature.description}</p>
                  <p className="text-sm text-muted-foreground">{feature.descriptionBn}</p>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Trending Products */}
        <ProductRail
          title="Trending Products"
          titleBn="জনপ্রিয় প্রোডাক্ট"
          products={trendingProducts}
          showViewAll
          onViewAll={handleViewAll}
          visibleCards={3}
        />
        
        {/* Auraloom's Products */}
        <ProductRail
          title="Auraloom's Products"
          titleBn="Auraloom এর প্রোডাক্ট"
          products={auraloomProducts}
          showViewAll
          onViewAll={handleViewAll}
          visibleCards={3}
        />
        
        {/* Get Premium Section */}
        <div className="py-12">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="max-w-2xl mx-auto">
              <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 text-5xl">
                💎
              </div>
              <h1 className="mb-4">Upgrade to Auraloom Premium</h1>
              <p className="text-muted-foreground mb-4">
                Get full access to broadcast channels, trending updates, and exclusive features
              </p>
              <p className="mb-8">
                ব্রডকাস্ট চ্যানেল এবং ট্রেন্ডিং আপডেটে সম্পূর্ণ অ্যাক্সেস পান
              </p>
              <Button
                size="lg"
                onClick={() => window.location.hash = 'subscription'}
              >
                Get Premium — প্রিমিয়াম নিন
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card mt-12 py-12 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h2 className="mb-4">Auraloom</h2>
              <p className="text-sm text-muted-foreground">
                Bangladesh's leading B2B textile marketplace
              </p>
            </div>
            
            <div>
              <h3 className="mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => window.location.hash = ''}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => window.location.hash = 'subscription'}
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => window.location.hash = 'login'}
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Dhaka, Bangladesh</li>
                <li>support@auraloom.com</li>
                <li>+880 1234 567890</li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <button className="h-10 w-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  f
                </button>
                <button className="h-10 w-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  in
                </button>
                <button className="h-10 w-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  tw
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Auraloom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
