import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Bell, BellOff, Lock, Heart, Eye, Pin, Share2, ThumbsUp, Flame, Lightbulb } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function BuyerBroadcastPage() {
  const {
    user,
    broadcasts,
    broadcastChannels,
    sellers,
    products,
    followedSellers,
    viewBroadcast,
    addReaction,
    removeReaction,
    forwardBroadcast,
    subscribeToChannel,
    unsubscribeFromChannel,
  } = useStore();
  const [mutedChannels, setMutedChannels] = useState<string[]>([]);
  
  const toggleMute = (channelId: string) => {
    setMutedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };
  
  // Get subscribed channels
  const subscribedChannelIds = broadcastChannels
    .filter((c) => user && c.subscribers.includes(user.id))
    .map((c) => c.id);
  
  // Auto-mark broadcasts as viewed when they appear
  useEffect(() => {
    if (user?.mode === 'buyer' && user?.membership === 'premium') {
      const viewedBroadcasts = new Set<string>();
      
      followedBroadcasts.forEach((broadcast) => {
        if (!broadcast.views.includes(user.id) && !viewedBroadcasts.has(broadcast.id)) {
          viewBroadcast(broadcast.id, user.id);
          viewedBroadcasts.add(broadcast.id);
        }
      });
    }
  }, [broadcasts]);
  
  const handleReaction = (broadcastId: string, reactionType: 'like' | 'love' | 'fire' | 'clap' | 'think') => {
    if (!user) return;
    
    const broadcast = broadcasts.find(b => b.id === broadcastId);
    if (!broadcast) return;
    
    const userReaction = broadcast.reactions.find(r => r.userId === user.id);
    
    if (userReaction && userReaction.type === reactionType) {
      removeReaction(broadcastId, user.id);
      toast.success('Reaction removed');
    } else {
      addReaction(broadcastId, user.id, reactionType);
      const emoji = {
        like: '👍',
        love: '❤️',
        fire: '🔥',
        clap: '👏',
        think: '💡',
      }[reactionType];
      toast.success(`${emoji} Reacted!`);
    }
  };
  
  const handleForward = (broadcastId: string) => {
    forwardBroadcast(broadcastId);
    toast.success('Broadcast forwarded');
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
    return `${diffDays} দিন আগে`;
  };
  
  // Show paywall for free buyers
  if (user?.mode === 'buyer' && user?.membership !== 'premium') {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-12 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <h2 className="mb-4">ব্রডকাস্ট চ্যানেল অ্যাক্সেস করুন</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              সেলারদের সর্বশেষ আপডেট, অফার এবং নিউজ পেতে Auraloom Broadcast Access সাবস্ক্রিপশন নিন।
            </p>
            
            <div className="bg-accent/50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-baseline gap-2 justify-center mb-2">
                <span className="text-primary">৳ ১০০০</span>
                <span className="text-muted-foreground">/ মাস</span>
              </div>
              <p className="text-sm text-muted-foreground">বায়ার প্রিমিয়াম সাবস্ক্রিপশন</p>
            </div>
            
            <Button
              size="lg"
              onClick={() => window.location.hash = 'subscription'}
            >
              এখনই সাবস্ক্রাইব করুন
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  const followedBroadcasts = broadcasts
    .filter((b) => {
      const channel = broadcastChannels.find((c) => c.id === b.channelId);
      return channel && followedSellers.includes(channel.sellerId);
    })
    .sort((a, b) => {
      // Pinned messages first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });
  
  // Get reaction counts
  const getReactionCounts = (broadcast: typeof broadcasts[0]) => {
    const counts: Record<string, number> = {};
    broadcast.reactions.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  };
  
  return (
    <div className="min-h-screen bg-[#f4f0db] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="mb-2">ব্রডকাস্ট চ্যানেল</h2>
          <p className="text-muted-foreground">
            আপনার ফলো করা সেলারদের লাইভ আপডেট এবং ঘোষণা
          </p>
        </div>
        
        {followedBroadcasts.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              📡
            </div>
            <h3 className="mb-2">কোনো ব্রডকাস্ট নেই</h3>
            <p className="text-muted-foreground mb-6">
              সেলার ফলো করুন তাদের আপডেট দেখতে
            </p>
            <Button onClick={() => window.location.hash = 'buyer'}>
              প্রোডাক্ট দেখুন
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {followedBroadcasts.map((broadcast) => {
              const channel = broadcastChannels.find((c) => c.id === broadcast.channelId);
              const seller = sellers.find((s) => s.id === broadcast.sellerId);
              const isMuted = channel && mutedChannels.includes(channel.id);
              const userReaction = user ? broadcast.reactions.find(r => r.userId === user.id) : null;
              const reactionCounts = getReactionCounts(broadcast);
              
              if (!seller || !channel) return null;
              
              return (
                <Card key={broadcast.id} className={`p-6 bg-white hover:shadow-lg transition-shadow ${broadcast.isPinned ? 'border-2 border-primary' : ''}`}>
                  {broadcast.isPinned && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-primary">
                      <Pin className="h-4 w-4" />
                      <span>Pinned message</span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <img
                      src={channel.avatar}
                      alt={channel.nameBn}
                      className="h-12 w-12 rounded-full cursor-pointer"
                      onClick={() => window.location.hash = `seller/${seller.id}`}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 
                            className="cursor-pointer hover:text-primary transition-colors"
                            onClick={() => window.location.hash = `seller/${seller.id}`}
                          >
                            {channel.nameBn}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {channel.name}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{formatTime(broadcast.timestamp)}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleMute(channel.id)}
                          >
                            {isMuted ? (
                              <BellOff className="h-4 w-4" />
                            ) : (
                              <Bell className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="mb-4">{broadcast.content}</p>
                      
                      {broadcast.image && (
                        <img
                          src={broadcast.image}
                          alt="Broadcast"
                          className="rounded-xl max-w-full h-auto mb-4"
                        />
                      )}
                      
                      {/* Product Preview if broadcast references a product */}
                      {broadcast.productId && (() => {
                        const product = products.find(p => p.id === broadcast.productId);
                        if (!product) return null;
                        
                        return (
                          <div 
                            className="bg-accent/30 rounded-xl p-4 mb-4 cursor-pointer hover:bg-accent/50 transition-colors border border-accent"
                            onClick={() => window.location.hash = `product/${product.id}`}
                          >
                            <p className="text-xs text-muted-foreground mb-2">📦 পণ্য</p>
                            <div className="flex gap-3">
                              <img
                                src={product.image}
                                alt={product.titleBn}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm line-clamp-2 mb-1">{product.titleBn}</h4>
                                <p className="text-primary mb-1">৳{product.price}</p>
                                <p className="text-xs text-muted-foreground">MOQ: {product.moq}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* Reaction Summary */}
                      {broadcast.reactions.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {Object.entries(reactionCounts).map(([type, count]) => {
                            const emoji = {
                              like: '👍',
                              love: '❤️',
                              fire: '🔥',
                              clap: '👏',
                              think: '💡',
                            }[type as keyof typeof reactionCounts] || '👍';
                            
                            return (
                              <Badge key={type} variant="outline" className="text-xs">
                                {emoji} {count}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Engagement Section */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {broadcast.views.length}
                          </span>
                          {broadcast.forwards > 0 && (
                            <span className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" />
                              {broadcast.forwards}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {/* Reaction Picker */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={userReaction ? "default" : "outline"}
                                size="sm"
                              >
                                {userReaction ? (
                                  <>
                                    {
                                      {
                                        like: '👍',
                                        love: '❤️',
                                        fire: '🔥',
                                        clap: '👏',
                                        think: '💡',
                                      }[userReaction.type]
                                    }
                                  </>
                                ) : (
                                  <>
                                    <Heart className="h-4 w-4 mr-1" />
                                    React
                                  </>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReaction(broadcast.id, 'like')}
                                  className="text-2xl hover:scale-125 transition-transform"
                                >
                                  👍
                                </button>
                                <button
                                  onClick={() => handleReaction(broadcast.id, 'love')}
                                  className="text-2xl hover:scale-125 transition-transform"
                                >
                                  ❤️
                                </button>
                                <button
                                  onClick={() => handleReaction(broadcast.id, 'fire')}
                                  className="text-2xl hover:scale-125 transition-transform"
                                >
                                  🔥
                                </button>
                                <button
                                  onClick={() => handleReaction(broadcast.id, 'clap')}
                                  className="text-2xl hover:scale-125 transition-transform"
                                >
                                  👏
                                </button>
                                <button
                                  onClick={() => handleReaction(broadcast.id, 'think')}
                                  className="text-2xl hover:scale-125 transition-transform"
                                >
                                  💡
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleForward(broadcast.id)}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Forward
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.hash = `seller/${seller.id}`}
                          >
                            দোকান দেখুন
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.hash = `messages?seller=${seller.id}`}
                          >
                            মেসেজ পাঠান
                          </Button>
                        </div>
                      </div>
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
