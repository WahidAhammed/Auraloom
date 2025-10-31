import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';

interface CreateBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBroadcastModal({ open, onOpenChange }: CreateBroadcastModalProps) {
  const { user, broadcasts, broadcastChannels, sellers, products, addBroadcast, createBroadcastChannel } = useStore();
  const [content, setContent] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  
  const seller = sellers.find((s) => s.id === user?.id);
  
  // Get or create channel for this seller
  let sellerChannel = broadcastChannels.find((c) => c.sellerId === user?.id);
  
  // Auto-create channel if it doesn't exist
  if (!sellerChannel && user?.mode === 'seller') {
    const newChannel = {
      id: `bc-${user.id}-${Date.now()}`,
      sellerId: user.id,
      name: `${seller?.name || 'My'} Updates`,
      nameBn: `${seller?.nameBn || 'আমার'} আপডেট`,
      description: 'Official broadcast channel',
      descriptionBn: 'অফিসিয়াল ব্রডকাস্ট চ্যানেল',
      avatar: seller?.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.id}`,
      subscribers: [],
      createdAt: Date.now(),
      isPremiumOnly: false,
      messageCount: 0,
      settings: {
        notificationsEnabled: true,
        allowComments: false,
        showSubscriberCount: true,
      },
    };
    createBroadcastChannel(newChannel);
    sellerChannel = newChannel;
  }
  
  const channelBroadcasts = broadcasts.filter((b) => b.channelId === sellerChannel?.id);
  
  const isFree = user?.membership !== 'premium';
  const hasReachedLimit = isFree && channelBroadcasts.length >= 2;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter broadcast content');
      return;
    }
    
    if (!sellerChannel) {
      toast.error('Channel not found. Please try again.');
      return;
    }
    
    if (hasReachedLimit) {
      toast.error('Upgrade to premium for unlimited broadcasts');
      window.location.hash = 'subscription';
      onOpenChange(false);
      return;
    }
    
    addBroadcast({
      id: `b-${Date.now()}`,
      channelId: sellerChannel.id,
      sellerId: user!.id,
      content: content.trim(),
      productId: selectedProduct || undefined,
      timestamp: Date.now(),
      views: [],
      reactions: [],
      forwards: 0,
      isPinned: false,
    });
    
    toast.success('ব্রডকাস্ট সফলভাবে পোস্ট হয়েছে!');
    setContent('');
    setSelectedProduct('');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>নতুন ব্রডকাস্ট তৈরি করুন</DialogTitle>
        </DialogHeader>
        
        {sellerChannel && (
          <div className="bg-accent/30 rounded-xl p-3 mb-4 flex items-center gap-3">
            <img src={sellerChannel.avatar} alt={sellerChannel.nameBn} className="h-10 w-10 rounded-full" />
            <div>
              <p className="text-sm">{sellerChannel.nameBn}</p>
              <p className="text-xs text-muted-foreground">
                {sellerChannel.subscribers.length} subscribers
              </p>
            </div>
          </div>
        )}
        
        {hasReachedLimit && (
          <Alert className="mb-4">
            <AlertDescription>
              ফ্রি অ্যাকাউন্টে সর্বোচ্চ ২টি ব্রডকাস্ট পোস্ট করতে পারবেন। আরো পোস্ট করতে প্রিমিয়াম সাবস্ক্রিপশন নিন।
            </AlertDescription>
          </Alert>
        )}
        
        {isFree && !hasReachedLimit && (
          <Alert className="mb-4">
            <AlertDescription>
              আপনি {2 - channelBroadcasts.length}টি ব্রডকাস্ট পোস্ট করতে পারবেন। সীমাহীন পোস্ট করতে প্রিমিয়াম নিন।
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="আপনার ব্রডকাস্ট মেসেজ লিখুন... (নতুন পণ্য, অফার, আপডেট)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                disabled={hasReachedLimit}
              />
            </div>
            
            {/* Product Attachment */}
            <div>
              <label className="text-sm mb-2 block">পণ্য সংযুক্ত করুন (ঐচ্ছিক)</label>
              {selectedProduct ? (
                <div className="bg-accent/30 rounded-xl p-4 border border-accent">
                  <div className="flex items-start gap-3">
                    <img
                      src={products.find(p => p.id === selectedProduct)?.image}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm line-clamp-1 mb-1">
                        {products.find(p => p.id === selectedProduct)?.titleBn}
                      </h4>
                      <p className="text-xs text-primary">
                        ৳{products.find(p => p.id === selectedProduct)?.price}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProduct('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="একটি পণ্য নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {products
                      .filter(p => p.sellerId === user?.id)
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.titleBn} - ৳{product.price}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {channelBroadcasts.length}/
                {isFree ? '2' : '∞'} ব্রডকাস্ট পোস্ট করা হয়েছে
              </p>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  বাতিল করুন
                </Button>
                {hasReachedLimit ? (
                  <Button
                    type="button"
                    onClick={() => {
                      window.location.hash = 'subscription';
                      onOpenChange(false);
                    }}
                  >
                    প্রিমিয়াম নিন
                  </Button>
                ) : (
                  <Button type="submit">পোস্ট করুন</Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
