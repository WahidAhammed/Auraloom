import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export function MessagingPage() {
  const { user, messages, sellers, sendMessage, products } = useStore();
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [initialMessage, setInitialMessage] = useState<string>('');
  
  // Get URL params for pre-selected seller
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const preselectedSeller = urlParams.get('seller');
    const productId = urlParams.get('product');
    
    if (preselectedSeller) {
      setSelectedSeller(preselectedSeller);
      
      // If coming from a product page, set initial message
      if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
          setInitialMessage(`হ্যালো, আমি ${product.titleBn} সম্পর্কে জানতে আগ্রহী।`);
        }
      }
    }
  }, [products]);
  
  // Group messages by conversation
  const conversations = sellers.map((seller) => {
    const sellerMessages = messages.filter(
      (m) =>
        (m.senderId === user?.id && m.receiverId === seller.id) ||
        (m.senderId === seller.id && m.receiverId === user?.id)
    );
    
    return {
      seller,
      messages: sellerMessages.sort((a, b) => a.timestamp - b.timestamp),
      unread: sellerMessages.filter((m) => m.receiverId === user?.id && !m.read).length,
      lastMessage: sellerMessages[sellerMessages.length - 1],
    };
  }).filter((c) => c.messages.length > 0);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedSeller) return;
    
    sendMessage({
      id: `msg-${Date.now()}`,
      senderId: user!.id,
      receiverId: selectedSeller,
      content: messageText.trim(),
      timestamp: Date.now(),
      read: false,
    });
    
    setMessageText('');
  };
  
  const selectedConversation = conversations.find(
    (c) => c.seller.id === selectedSeller
  );
  
  // If a seller is selected but no conversation exists, create a virtual one
  const selectedSellerData = selectedSeller ? sellers.find(s => s.id === selectedSeller) : null;
  const displayConversation = selectedConversation || (selectedSellerData ? {
    seller: selectedSellerData,
    messages: [],
    unread: 0,
    lastMessage: undefined,
  } : null);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-6">মেসেজ</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Conversations List */}
          <Card className="md:col-span-1 p-4">
            <h3 className="mb-4">কথোপকথন</h3>
            
            <ScrollArea className="h-[600px]">
              {conversations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>কোনো মেসেজ নেই</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.seller.id}
                      className={`w-full text-left p-3 rounded-xl transition-colors ${
                        selectedSeller === conv.seller.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedSeller(conv.seller.id)}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={conv.seller.logo}
                          alt={conv.seller.nameBn}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`truncate ${
                              selectedSeller === conv.seller.id ? 'text-white' : ''
                            }`}>
                              {conv.seller.nameBn}
                            </p>
                            {conv.unread > 0 && (
                              <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className={`text-sm truncate ${
                              selectedSeller === conv.seller.id
                                ? 'text-white/80'
                                : 'text-muted-foreground'
                            }`}>
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
          
          {/* Chat Area */}
          <Card className="md:col-span-2 p-4 flex flex-col">
            {displayConversation ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b mb-4">
                  <img
                    src={displayConversation.seller.logo}
                    alt={displayConversation.seller.nameBn}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h3>{displayConversation.seller.nameBn}</h3>
                    <p className="text-sm text-muted-foreground">
                      {displayConversation.seller.name}
                    </p>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 h-[500px] pr-4">
                  <div className="space-y-4">
                    {displayConversation.messages.map((message) => {
                      const isOwn = message.senderId === user?.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isOwn
                                ? 'bg-primary text-white'
                                : 'bg-accent'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-white/70' : 'text-muted-foreground'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <form onSubmit={handleSendMessage} className="mt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="মেসেজ লিখুন..."
                      value={messageText || initialMessage}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        setInitialMessage('');
                      }}
                      onFocus={() => {
                        if (initialMessage && !messageText) {
                          setMessageText(initialMessage);
                          setInitialMessage('');
                        }
                      }}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    💬
                  </div>
                  <p>একটি কথোপকথন নির্বাচন করুন</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}