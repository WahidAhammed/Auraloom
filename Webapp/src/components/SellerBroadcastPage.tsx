import { useState } from 'react';
import { useStore } from '../lib/store';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Eye, Heart, Trash2, Users, Radio, Pin, PinOff, Share2, Settings } from 'lucide-react';
import { Badge } from './ui/badge';
import { CreateBroadcastModal } from './CreateBroadcastModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

export function SellerBroadcastPage() {
  const {
    user,
    broadcasts,
    broadcastChannels,
    sellers,
    products,
    followedSellers,
    deleteBroadcast,
    pinBroadcast,
    unpinBroadcast,
    createBroadcastChannel,
  } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Get or create channel for this seller
  let sellerChannel = broadcastChannels.find((c) => c.sellerId === user?.id);
  
  // Auto-create channel if it doesn't exist
  if (!sellerChannel && user?.mode === 'seller') {
    const seller = sellers.find((s) => s.id === user?.id);
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
  
  // Get seller's own broadcasts
  const myBroadcasts = broadcasts
    .filter((b) => b.sellerId === user?.id)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  // Get current seller data
  const currentSeller = sellers.find((s) => s.id === user?.id);
  
  // Get subscribers data (mock user data for demonstration)
  const subscribersList = sellerChannel?.subscribers.slice(0, 20).map((userId, index) => ({
    id: userId,
    name: `Buyer ${index + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
  })) || [];
  
  const handleDelete = (broadcastId: string) => {
    deleteBroadcast(broadcastId);
    toast.success('Broadcast deleted');
  };
  
  const handlePin = (broadcastId: string, isPinned: boolean) => {
    if (isPinned) {
      unpinBroadcast(broadcastId);
      toast.success('Message unpinned');
    } else {
      pinBroadcast(broadcastId);
      toast.success('Message pinned to top');
    }
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
  
  const totalViews = myBroadcasts.reduce((sum, b) => sum + b.views.length, 0);
  const totalReactions = myBroadcasts.reduce((sum, b) => sum + b.reactions.length, 0);
  const totalForwards = myBroadcasts.reduce((sum, b) => sum + b.forwards, 0);
  const avgEngagement = myBroadcasts.length > 0 
    ? ((totalReactions / (totalViews || 1)) * 100).toFixed(1)
    : '0';
  
  // Get reaction counts for each broadcast
  const getReactionCounts = (broadcast: typeof broadcasts[0]) => {
    const counts: Record<string, number> = {};
    broadcast.reactions.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  };
  
  return (
    <div className="min-h-screen bg-[#f4f0db] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-2">Broadcast Channel Management</h2>
              <p className="text-muted-foreground">
                Manage your channel and track engagement
              </p>
            </div>
            <Button onClick={() => setCreateModalOpen(true)} size="lg">
              <Radio className="h-5 w-5 mr-2" />
              Create Broadcast
            </Button>
          </div>
          
          {/* Channel Info Card */}
          {sellerChannel && (
            <Card className="p-6 bg-white mb-6">
              <div className="flex items-start gap-4">
                <img src={sellerChannel.avatar} alt={sellerChannel.nameBn} className="h-16 w-16 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1">{sellerChannel.nameBn}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{sellerChannel.name}</p>
                      <p className="text-sm text-muted-foreground">{sellerChannel.descriptionBn}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <span>{sellerChannel.subscribers.length} subscribers</span>
                    <span>{sellerChannel.messageCount} messages</span>
                    {sellerChannel.isPremiumOnly && (
                      <Badge variant="secondary">Premium Only</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl">{myBroadcasts.length}</p>
            </Card>
            
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Views</p>
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl">{totalViews}</p>
            </Card>
            
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Reactions</p>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-3xl">{totalReactions}</p>
            </Card>
            
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Subscribers</p>
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl">{sellerChannel?.subscribers.length || 0}</p>
            </Card>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Broadcasts List */}
          <div className="lg:col-span-2">
            <h3 className="mb-4">Your Broadcasts</h3>
            
            {myBroadcasts.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  📡
                </div>
                <h3 className="mb-2">No broadcasts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first broadcast to reach your subscribers
                </p>
                <Button onClick={() => setCreateModalOpen(true)}>
                  Create Broadcast
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBroadcasts.map((broadcast) => {
                  const reactionCounts = getReactionCounts(broadcast);
                  
                  return (
                    <Card key={broadcast.id} className={`p-6 bg-white ${broadcast.isPinned ? 'border-2 border-primary' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {broadcast.isPinned && (
                              <Badge variant="default" className="bg-primary">
                                <Pin className="h-3 w-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                            <Badge variant="secondary">{formatTime(broadcast.timestamp)}</Badge>
                          </div>
                          <p className="mb-4">{broadcast.content}</p>
                          
                          {broadcast.image && (
                            <img
                              src={broadcast.image}
                              alt="Broadcast"
                              className="rounded-xl max-w-full h-auto mb-4"
                            />
                          )}
                          
                          {/* Product Preview */}
                          {broadcast.productId && (() => {
                            const product = products.find(p => p.id === broadcast.productId);
                            if (!product) return null;
                            
                            return (
                              <div className="bg-accent/30 rounded-xl p-4 mb-4 border border-accent">
                                <p className="text-xs text-muted-foreground mb-2">📦 সংযুক্ত পণ্য</p>
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
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePin(broadcast.id, broadcast.isPinned)}
                            title={broadcast.isPinned ? 'Unpin message' : 'Pin message'}
                          >
                            {broadcast.isPinned ? (
                              <PinOff className="h-4 w-4" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Broadcast</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this broadcast? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(broadcast.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {/* Engagement Stats */}
                      <div className="flex items-center gap-6 pt-4 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <Eye className="h-4 w-4" />
                              <span>{broadcast.views.length} views</span>
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Viewers</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[300px]">
                              {broadcast.views.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No views yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {broadcast.views.map((viewerId, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent">
                                      <Avatar className="h-8 w-8">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewerId}`} alt="Viewer" />
                                      </Avatar>
                                      <span className="text-sm">Buyer {index + 1}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <Heart className="h-4 w-4" />
                              <span>{broadcast.reactions.length} reactions</span>
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reactions</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[300px]">
                              {broadcast.reactions.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No reactions yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {broadcast.reactions.map((reaction, index) => {
                                    const emoji = {
                                      like: '👍',
                                      love: '❤️',
                                      fire: '🔥',
                                      clap: '👏',
                                      think: '💡',
                                    }[reaction.type] || '👍';
                                    
                                    return (
                                      <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent">
                                        <Avatar className="h-8 w-8">
                                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reaction.userId}`} alt="Reactor" />
                                        </Avatar>
                                        <span className="text-sm flex-1">Buyer {index + 1}</span>
                                        <span className="text-xl">{emoji}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        
                        {broadcast.forwards > 0 && (
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Share2 className="h-4 w-4" />
                            <span>{broadcast.forwards} forwards</span>
                          </span>
                        )}
                        
                        {broadcast.views.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {avgEngagement}% engagement
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Sidebar - Subscribers Management */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white sticky top-24">
              <h4 className="mb-4">Subscribers ({subscribersList.length})</h4>
              
              <ScrollArea className="h-[500px] pr-4">
                {subscribersList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No subscribers yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subscribersList.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <img src={subscriber.avatar} alt={subscriber.name} />
                          </Avatar>
                          <div>
                            <p className="text-sm">{subscriber.name}</p>
                            <p className="text-xs text-muted-foreground">Active subscriber</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
      
      <CreateBroadcastModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
