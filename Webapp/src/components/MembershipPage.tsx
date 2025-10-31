import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';

export function MembershipPage() {
  const { user, setMembership, setUserMode } = useStore();
  
  const handleUpgrade = (tier: 'premium', userType: 'buyer' | 'seller') => {
    if (user?.mode === 'guest') {
      toast.error('Please login first');
      setUserMode(userType);
      return;
    }
    
    setMembership(tier);
    toast.success('🎉 আপনার প্রিমিয়াম সাবস্ক্রিপশন সক্রিয় হয়েছে!');
    
    setTimeout(() => {
      if (user?.mode === 'buyer') {
        window.location.hash = 'buyer';
      } else if (user?.mode === 'seller') {
        window.location.hash = 'seller';
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-primary text-white rounded-full mb-4">
            🟥 Auraloom প্রিমিয়াম সাবস্ক্রিপশন
          </div>
          <h1 className="text-primary mb-4">আপনার ব্যবসাকে আরও এগিয়ে নিন</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            আপনার ব্যবসাকে আরও এগিয়ে নিতে এখনই প্রিমিয়াম নিন এবং সম্পূর্ণ ফিচার অ্যাক্সেস করুন
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Buyer Premium Plan */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                  💎
                </div>
                <div>
                  <h3>বায়ার প্রিমিয়াম</h3>
                  <p className="text-muted-foreground">Buyer Premium</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-primary">৳ ১০০০</span>
                  <span className="text-muted-foreground">/ মাস</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>🔹 ট্রেন্ডিং প্রোডাক্ট</p>
                  <p className="text-sm text-muted-foreground">Trending Products Access</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>🔹 ব্রডকাস্ট অ্যাক্সেস</p>
                  <p className="text-sm text-muted-foreground">Broadcast Channel Access</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>🔹 লাইভ আপডেট</p>
                  <p className="text-sm text-muted-foreground">Live Updates from Sellers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>🔹 প্রাইয়োরিটি মেসেজিং</p>
                  <p className="text-sm text-muted-foreground">Priority Messaging Support</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90"
              onClick={() => handleUpgrade('premium', 'buyer')}
              disabled={user?.mode === 'buyer' && user?.membership === 'premium'}
            >
              {user?.mode === 'buyer' && user?.membership === 'premium' 
                ? '✓ সক্রিয় সাবস্ক্রিপশন' 
                : 'এখনই আপগ্রেড করুন'}
            </Button>
          </Card>
          
          {/* Seller Premium Plans */}
          <Card className="p-8 hover:shadow-xl transition-shadow border-primary">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
                  🏪
                </div>
                <div>
                  <h3>সেলার প্রিমিয়াম</h3>
                  <p className="text-muted-foreground">Seller Premium</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-primary">৳ ২০০০</span>
                  <span className="text-muted-foreground">/ মাস</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary">৳ ৫০০০</span>
                  <span className="text-muted-foreground">/ ৩ মাস</span>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">১৭% সাশ্রয়</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary">৳ ২০০০০</span>
                  <span className="text-muted-foreground">/ ১ বছর</span>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">১৭% সাশ্রয়</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>✅ সীমাহীন ব্রডকাস্ট পোস্ট</p>
                  <p className="text-sm text-muted-foreground">Unlimited Broadcast Posts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>✅ সীমাহীন প্রোডাক্ট লিস্টিং</p>
                  <p className="text-sm text-muted-foreground">Unlimited Product Listings</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>✅ ফলোয়ার এনালিটিক্স</p>
                  <p className="text-sm text-muted-foreground">Follower Analytics Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>✅ মার্কেট ভিজিবিলিটি</p>
                  <p className="text-sm text-muted-foreground">Enhanced Market Visibility</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>✅ প্রাইয়োরিটি সাপোর্ট</p>
                  <p className="text-sm text-muted-foreground">24/7 Priority Support</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => handleUpgrade('premium', 'seller')}
              disabled={user?.mode === 'seller' && user?.membership === 'premium'}
            >
              {user?.mode === 'seller' && user?.membership === 'premium' 
                ? '✓ সক্রিয় সাবস্ক্রিপশন' 
                : 'এখনই আপগ্রেড করুন'}
            </Button>
          </Card>
        </div>
        
        {/* Free vs Premium Comparison */}
        <Card className="p-8">
          <h3 className="text-center mb-8">ফ্রি বনাম প্রিমিয়াম তুলনা</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">বৈশিষ্ট্য</th>
                  <th className="text-center py-4 px-4">ফ্রি</th>
                  <th className="text-center py-4 px-4">প্রিমিয়াম</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">প্রোডাক্ট লিস্টিং (সেলার)</td>
                  <td className="text-center py-4 px-4">২টি</td>
                  <td className="text-center py-4 px-4 text-primary">সীমাহীন</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">ব্রডকাস্ট পোস্ট (সেলার)</td>
                  <td className="text-center py-4 px-4">২টি</td>
                  <td className="text-center py-4 px-4 text-primary">সীমাহীন</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">ব্রডকাস্ট অ্যাক্সেস (বায়ার)</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 text-primary">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">এনালিটিক্স</td>
                  <td className="text-center py-4 px-4">বেসিক</td>
                  <td className="text-center py-4 px-4 text-primary">এডভান্সড</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">কাস্টমার সাপোর্ট</td>
                  <td className="text-center py-4 px-4">স্ট্যান্ডার্ড</td>
                  <td className="text-center py-4 px-4 text-primary">প্রাইয়োরিটি</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
