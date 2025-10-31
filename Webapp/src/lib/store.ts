import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserMode = 'guest' | 'buyer' | 'seller';
export type MembershipTier = 'free' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  mode: UserMode;
  membership: MembershipTier;
  avatar?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  titleBn: string;
  price: number;
  moq: string;
  blend: string;
  category: 'fabric' | 'yarn' | 'jute' | 'leather' | 'fiber';
  image: string;
  description: string;
  descriptionBn: string;
}

export interface Seller {
  id: string;
  name: string;
  nameBn: string;
  logo: string;
  description: string;
  descriptionBn: string;
  followers: number;
  productCount: number;
  broadcastCount: number;
  verified?: boolean;
  categories?: string[];
  banner?: string;
}

// Telegram-style Broadcast Channel
export interface BroadcastChannel {
  id: string;
  sellerId: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  avatar: string;
  subscribers: string[]; // Array of user IDs subscribed to this channel
  createdAt: number;
  isPremiumOnly: boolean; // Whether only premium buyers can subscribe
  messageCount: number;
  pinnedMessageId?: string;
  settings: {
    notificationsEnabled: boolean;
    allowComments: boolean;
    showSubscriberCount: boolean;
  };
}

// Individual Broadcast Message in a Channel
export interface Broadcast {
  id: string;
  channelId: string; // Reference to BroadcastChannel
  sellerId: string;
  content: string;
  image?: string;
  productId?: string; // Optional product reference
  timestamp: number;
  views: string[]; // Array of user IDs who viewed
  reactions: {
    type: 'like' | 'love' | 'fire' | 'clap' | 'think';
    userId: string;
  }[]; // Telegram-style reactions
  forwards: number; // How many times this was forwarded
  isPinned: boolean;
  editedAt?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Notification {
  id: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: 'order' | 'message' | 'broadcast' | 'follow';
}

interface AppState {
  user: User | null;
  products: Product[];
  sellers: Seller[];
  broadcastChannels: BroadcastChannel[];
  broadcasts: Broadcast[];
  messages: Message[];
  cart: CartItem[];
  notifications: Notification[];
  followedSellers: string[];
  
  // User actions
  setUser: (user: User | null) => void;
  setUserMode: (mode: UserMode) => void;
  setMembership: (tier: MembershipTier) => void;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Seller actions
  setSellers: (sellers: Seller[]) => void;
  followSeller: (sellerId: string) => void;
  unfollowSeller: (sellerId: string) => void;
  
  // Broadcast Channel actions
  setBroadcastChannels: (channels: BroadcastChannel[]) => void;
  createBroadcastChannel: (channel: BroadcastChannel) => void;
  updateBroadcastChannel: (id: string, updates: Partial<BroadcastChannel>) => void;
  subscribeToChannel: (channelId: string, userId: string) => void;
  unsubscribeFromChannel: (channelId: string, userId: string) => void;
  
  // Broadcast Message actions
  setBroadcasts: (broadcasts: Broadcast[]) => void;
  addBroadcast: (broadcast: Broadcast) => void;
  viewBroadcast: (broadcastId: string, userId: string) => void;
  addReaction: (broadcastId: string, userId: string, reactionType: 'like' | 'love' | 'fire' | 'clap' | 'think') => void;
  removeReaction: (broadcastId: string, userId: string) => void;
  pinBroadcast: (broadcastId: string) => void;
  unpinBroadcast: (broadcastId: string) => void;
  deleteBroadcast: (broadcastId: string) => void;
  forwardBroadcast: (broadcastId: string) => void;
  
  // Deprecated - kept for backwards compatibility
  likeBroadcast: (broadcastId: string, userId: string) => void;
  unlikeBroadcast: (broadcastId: string, userId: string) => void;
  
  // Message actions
  sendMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Cart actions
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user1',
        name: 'Demo User',
        email: 'demo@auraloom.com',
        mode: 'guest',
        membership: 'free',
      },
      products: [],
      sellers: [],
      broadcastChannels: [],
      broadcasts: [],
      messages: [],
      cart: [],
      notifications: [],
      followedSellers: [],
      
      setUser: (user) => set({ user }),
      
      setUserMode: (mode) => set((state) => ({
        user: state.user ? { ...state.user, mode } : null,
      })),
      
      setMembership: (tier) => set((state) => ({
        user: state.user ? { ...state.user, membership: tier } : null,
      })),
      
      setProducts: (products) => set({ products }),
      
      addProduct: (product) => set((state) => ({
        products: [...state.products, product],
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),
      
      setSellers: (sellers) => set({ sellers }),
      
      followSeller: (sellerId) => {
        const state = get();
        if (!state.followedSellers.includes(sellerId)) {
          set({
            followedSellers: [...state.followedSellers, sellerId],
            sellers: state.sellers.map((s) =>
              s.id === sellerId ? { ...s, followers: s.followers + 1 } : s
            ),
          });
          
          // Auto-subscribe to seller's broadcast channel if it exists
          const channel = state.broadcastChannels.find((c) => c.sellerId === sellerId);
          if (channel && state.user) {
            state.subscribeToChannel(channel.id, state.user.id);
          }
          
          // Add notification
          const seller = state.sellers.find((s) => s.id === sellerId);
          if (seller) {
            state.addNotification({
              id: `notif-${Date.now()}`,
              content: `You followed ${seller.name}`,
              timestamp: Date.now(),
              read: false,
              type: 'follow',
            });
          }
        }
      },
      
      unfollowSeller: (sellerId) => {
        const state = get();
        
        // Auto-unsubscribe from seller's broadcast channel
        const channel = state.broadcastChannels.find((c) => c.sellerId === sellerId);
        if (channel && state.user) {
          state.unsubscribeFromChannel(channel.id, state.user.id);
        }
        
        set({
          followedSellers: state.followedSellers.filter((id) => id !== sellerId),
          sellers: state.sellers.map((s) =>
            s.id === sellerId ? { ...s, followers: Math.max(0, s.followers - 1) } : s
          ),
        });
      },
      
      // Broadcast Channel actions
      setBroadcastChannels: (channels) => set({ broadcastChannels: channels }),
      
      createBroadcastChannel: (channel) => {
        const state = get();
        set({
          broadcastChannels: [...state.broadcastChannels, channel],
        });
        
        state.addNotification({
          id: `notif-${Date.now()}`,
          content: `Broadcast channel "${channel.name}" created successfully`,
          timestamp: Date.now(),
          read: false,
          type: 'broadcast',
        });
      },
      
      updateBroadcastChannel: (id, updates) => set((state) => ({
        broadcastChannels: state.broadcastChannels.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      })),
      
      subscribeToChannel: (channelId, userId) => {
        const state = get();
        const channel = state.broadcastChannels.find((c) => c.id === channelId);
        
        if (channel && !channel.subscribers.includes(userId)) {
          set({
            broadcastChannels: state.broadcastChannels.map((c) =>
              c.id === channelId
                ? { ...c, subscribers: [...c.subscribers, userId] }
                : c
            ),
          });
          
          state.addNotification({
            id: `notif-${Date.now()}`,
            content: `Subscribed to ${channel.name}`,
            timestamp: Date.now(),
            read: false,
            type: 'broadcast',
          });
        }
      },
      
      unsubscribeFromChannel: (channelId, userId) => {
        const state = get();
        set({
          broadcastChannels: state.broadcastChannels.map((c) =>
            c.id === channelId
              ? { ...c, subscribers: c.subscribers.filter((id) => id !== userId) }
              : c
          ),
        });
      },
      
      // Broadcast Message actions
      setBroadcasts: (broadcasts) => set({ broadcasts }),
      
      addBroadcast: (broadcast) => {
        const state = get();
        set({
          broadcasts: [broadcast, ...state.broadcasts],
          broadcastChannels: state.broadcastChannels.map((c) =>
            c.id === broadcast.channelId
              ? { ...c, messageCount: c.messageCount + 1 }
              : c
          ),
          sellers: state.sellers.map((s) =>
            s.id === broadcast.sellerId
              ? { ...s, broadcastCount: s.broadcastCount + 1 }
              : s
          ),
        });
        
        // Add notification to channel subscribers
        const channel = state.broadcastChannels.find((c) => c.id === broadcast.channelId);
        if (channel) {
          state.addNotification({
            id: `notif-${Date.now()}`,
            content: `${channel.name} posted a new message`,
            timestamp: Date.now(),
            read: false,
            type: 'broadcast',
          });
        }
      },
      
      viewBroadcast: (broadcastId, userId) => {
        const state = get();
        set({
          broadcasts: state.broadcasts.map((b) =>
            b.id === broadcastId && !b.views.includes(userId)
              ? { ...b, views: [...b.views, userId] }
              : b
          ),
        });
      },
      
      addReaction: (broadcastId, userId, reactionType) => {
        const state = get();
        const broadcast = state.broadcasts.find((b) => b.id === broadcastId);
        
        if (broadcast) {
          // Remove existing reaction from this user if any
          const filteredReactions = broadcast.reactions.filter((r) => r.userId !== userId);
          
          set({
            broadcasts: state.broadcasts.map((b) =>
              b.id === broadcastId
                ? { ...b, reactions: [...filteredReactions, { type: reactionType, userId }] }
                : b
            ),
          });
        }
      },
      
      removeReaction: (broadcastId, userId) => {
        const state = get();
        set({
          broadcasts: state.broadcasts.map((b) =>
            b.id === broadcastId
              ? { ...b, reactions: b.reactions.filter((r) => r.userId !== userId) }
              : b
          ),
        });
      },
      
      pinBroadcast: (broadcastId) => {
        const state = get();
        const broadcast = state.broadcasts.find((b) => b.id === broadcastId);
        
        if (broadcast) {
          set({
            broadcasts: state.broadcasts.map((b) =>
              b.id === broadcastId ? { ...b, isPinned: true } : b
            ),
            broadcastChannels: state.broadcastChannels.map((c) =>
              c.id === broadcast.channelId ? { ...c, pinnedMessageId: broadcastId } : c
            ),
          });
        }
      },
      
      unpinBroadcast: (broadcastId) => {
        const state = get();
        const broadcast = state.broadcasts.find((b) => b.id === broadcastId);
        
        if (broadcast) {
          set({
            broadcasts: state.broadcasts.map((b) =>
              b.id === broadcastId ? { ...b, isPinned: false } : b
            ),
            broadcastChannels: state.broadcastChannels.map((c) =>
              c.id === broadcast.channelId && c.pinnedMessageId === broadcastId
                ? { ...c, pinnedMessageId: undefined }
                : c
            ),
          });
        }
      },
      
      forwardBroadcast: (broadcastId) => {
        const state = get();
        set({
          broadcasts: state.broadcasts.map((b) =>
            b.id === broadcastId ? { ...b, forwards: b.forwards + 1 } : b
          ),
        });
      },
      
      deleteBroadcast: (broadcastId) => {
        const state = get();
        const broadcast = state.broadcasts.find((b) => b.id === broadcastId);
        
        if (broadcast) {
          set({
            broadcasts: state.broadcasts.filter((b) => b.id !== broadcastId),
            broadcastChannels: state.broadcastChannels.map((c) =>
              c.id === broadcast.channelId
                ? {
                    ...c,
                    messageCount: Math.max(0, c.messageCount - 1),
                    pinnedMessageId: c.pinnedMessageId === broadcastId ? undefined : c.pinnedMessageId,
                  }
                : c
            ),
            sellers: state.sellers.map((s) =>
              s.id === broadcast.sellerId
                ? { ...s, broadcastCount: Math.max(0, s.broadcastCount - 1) }
                : s
            ),
          });
        }
      },
      
      // Deprecated - kept for backwards compatibility
      likeBroadcast: (broadcastId, userId) => {
        const state = get();
        state.addReaction(broadcastId, userId, 'like');
      },
      
      unlikeBroadcast: (broadcastId, userId) => {
        const state = get();
        state.removeReaction(broadcastId, userId);
      },
      
      sendMessage: (message) => {
        const state = get();
        set({
          messages: [...state.messages, message],
        });
        
        state.addNotification({
          id: `notif-${Date.now()}`,
          content: 'You have a new message',
          timestamp: Date.now(),
          read: false,
          type: 'message',
        });
      },
      
      markMessageAsRead: (messageId) => set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, read: true } : m
        ),
      })),
      
      addToCart: (productId, quantity) => {
        const state = get();
        const existingItem = state.cart.find((item) => item.productId === productId);
        
        if (existingItem) {
          set({
            cart: state.cart.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...state.cart, { productId, quantity }],
          });
        }
        
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          state.addNotification({
            id: `notif-${Date.now()}`,
            content: `Added ${product.title} to cart`,
            timestamp: Date.now(),
            read: false,
            type: 'order',
          });
        }
      },
      
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.productId !== productId),
      })),
      
      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      })),
      
      clearCart: () => set({ cart: [] }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
      })),
      
      markNotificationAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      })),
      
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'auraloom-storage',
    }
  )
);
