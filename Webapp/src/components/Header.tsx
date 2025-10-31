import { useState } from 'react';
import { useStore } from '../lib/store';
import { ShoppingCart, MessageCircle, Bell, User, Search, Menu, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { NotificationDropdown } from './NotificationDropdown';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';

export function Header() {
  const { user, cart, messages, notifications, setUserMode, products } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const unreadMessages = messages.filter(
    (m) => m.receiverId === user?.id && !m.read
  ).length;
  
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to buyer home with category filter
    if (selectedCategory !== 'all') {
      window.location.hash = `buyer?category=${selectedCategory}`;
    } else {
      window.location.hash = 'buyer';
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Immediately navigate when category changes
    if (category !== 'all') {
      window.location.hash = `buyer?category=${category}`;
    } else {
      window.location.hash = 'buyer';
    }
  };
  
  const handleModeSwitch = (newMode: 'guest' | 'buyer' | 'seller') => {
    setUserMode(newMode);
    if (newMode === 'guest') {
      window.location.hash = '';
    } else if (newMode === 'buyer') {
      window.location.hash = 'buyer';
    } else {
      window.location.hash = 'seller';
    }
  };
  
  const isGuest = user?.mode === 'guest';
  const auraloomProducts = products.slice(3, 6);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            {!isGuest && (
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    {user?.mode === 'buyer' && (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'buyer';
                            setMenuOpen(false);
                          }}
                        >
                          Home
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'broadcasts';
                            setMenuOpen(false);
                          }}
                        >
                          Broadcasts
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'followed-sellers';
                            setMenuOpen(false);
                          }}
                        >
                          Followed Sellers
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'cart';
                            setMenuOpen(false);
                          }}
                        >
                          Cart
                        </Button>
                        
                        {/* Auraloom's Products Submenu */}
                        <div className="border-t pt-2 mt-2">
                          <p className="px-4 py-2 text-sm text-muted-foreground">✨ Auraloom's Products</p>
                          {auraloomProducts.map((product) => (
                            <Button
                              key={product.id}
                              variant="ghost"
                              className="w-full justify-start text-sm"
                              onClick={() => {
                                window.location.hash = `product/${product.id}`;
                                setMenuOpen(false);
                              }}
                            >
                              {product.titleBn}
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'subscription';
                            setMenuOpen(false);
                          }}
                        >
                          Membership
                        </Button>
                      </>
                    )}
                    
                    {user?.mode === 'seller' && (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'seller';
                            setMenuOpen(false);
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'seller/products';
                            setMenuOpen(false);
                          }}
                        >
                          Products
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'seller/broadcasts';
                            setMenuOpen(false);
                          }}
                        >
                          Broadcasts
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            window.location.hash = 'subscription';
                            setMenuOpen(false);
                          }}
                        >
                          Membership
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <div 
              className="cursor-pointer"
              onClick={() => {
                if (user?.mode === 'buyer') {
                  window.location.hash = 'buyer';
                } else if (user?.mode === 'seller') {
                  window.location.hash = 'seller';
                } else {
                  window.location.hash = '';
                }
              }}
            >
              <h1 className="text-primary">Auraloom</h1>
            </div>
          </div>
          
          {/* Center: Search Bar */}
          {!isGuest && (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 bg-[#f4f0db] rounded-2xl px-4 py-2">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-32 border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="fabric">Fabric</SelectItem>
                    <SelectItem value="yarn">Yarn</SelectItem>
                    <SelectItem value="jute">Jute</SelectItem>
                    <SelectItem value="leather">Leather</SelectItem>
                    <SelectItem value="fiber">Fiber</SelectItem>
                  </SelectContent>
                </Select>
                
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none"
                />
                
                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          )}
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {isGuest ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => window.location.hash = 'login'}
                >
                  Login
                </Button>
                <Button
                  onClick={() => window.location.hash = 'subscription'}
                >
                  Premium
                </Button>
              </>
            ) : (
              <>
                {/* Messages */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => window.location.hash = 'messages'}
                >
                  <MessageCircle className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
                
                {/* Cart - only for buyers */}
                {user?.mode === 'buyer' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => window.location.hash = 'cart'}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                )}
                
                {/* Notifications - Hidden on mobile */}
                <div className="hidden md:block">
                  <NotificationDropdown />
                </div>
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary md:hidden">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p>{user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.mode === 'buyer' ? 'Buyer' : 'Seller'}
                        {user?.membership === 'premium' && ' • Premium'}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Notifications in mobile dropdown */}
                    <div className="md:hidden">
                      <DropdownMenuItem onClick={() => window.location.hash = 'notifications'}>
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                        {unreadNotifications > 0 && (
                          <Badge className="ml-auto">{unreadNotifications}</Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                    
                    <DropdownMenuItem onClick={() => window.location.hash = 'profile'}>
                      My Profile
                    </DropdownMenuItem>
                    
                    {user?.mode === 'buyer' && (
                      <DropdownMenuItem onClick={() => window.location.hash = 'orders'}>
                        My Orders
                      </DropdownMenuItem>
                    )}
                    
                    {user?.mode === 'seller' && (
                      <DropdownMenuItem onClick={() => window.location.hash = 'seller/analytics'}>
                        Analytics
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => window.location.hash = 'subscription'}>
                      Membership
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Mode Switching */}
                    {user?.mode === 'buyer' && (
                      <DropdownMenuItem onClick={() => handleModeSwitch('seller')}>
                        Switch to Seller
                      </DropdownMenuItem>
                    )}
                    
                    {user?.mode === 'seller' && (
                      <DropdownMenuItem onClick={() => handleModeSwitch('buyer')}>
                        Switch to Buyer
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleModeSwitch('guest')}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row: Menu + Logo + Actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {!isGuest && (
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-2">
                      {user?.mode === 'buyer' && (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'buyer';
                              setMenuOpen(false);
                            }}
                          >
                            Home
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'broadcasts';
                              setMenuOpen(false);
                            }}
                          >
                            Broadcasts
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'cart';
                              setMenuOpen(false);
                            }}
                          >
                            Cart
                          </Button>
                          
                          {/* Auraloom's Products Submenu */}
                          <div className="border-t pt-2 mt-2">
                            <p className="px-4 py-2 text-sm text-muted-foreground">✨ Auraloom's Products</p>
                            {auraloomProducts.map((product) => (
                              <Button
                                key={product.id}
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                onClick={() => {
                                  window.location.hash = `product/${product.id}`;
                                  setMenuOpen(false);
                                }}
                              >
                                {product.titleBn}
                              </Button>
                            ))}
                          </div>
                          
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'subscription';
                              setMenuOpen(false);
                            }}
                          >
                            Membership
                          </Button>
                        </>
                      )}
                      
                      {user?.mode === 'seller' && (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'seller';
                              setMenuOpen(false);
                            }}
                          >
                            Dashboard
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'seller/products';
                              setMenuOpen(false);
                            }}
                          >
                            Products
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'seller/broadcasts';
                              setMenuOpen(false);
                            }}
                          >
                            Broadcasts
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              window.location.hash = 'subscription';
                              setMenuOpen(false);
                            }}
                          >
                            Membership
                          </Button>
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              
              <div 
                className="cursor-pointer"
                onClick={() => {
                  if (user?.mode === 'buyer') {
                    window.location.hash = 'buyer';
                  } else if (user?.mode === 'seller') {
                    window.location.hash = 'seller';
                  } else {
                    window.location.hash = '';
                  }
                }}
              >
                <h1 className="text-primary">Auraloom</h1>
              </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              {isGuest ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.hash = 'login'}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.location.hash = 'subscription'}
                  >
                    Premium
                  </Button>
                </>
              ) : (
                <>
                  {/* Messages */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => window.location.hash = 'messages'}
                  >
                    <MessageCircle className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                  
                  {/* Cart - only for buyers */}
                  {user?.mode === 'buyer' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() => window.location.hash = 'cart'}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                          {cart.length}
                        </Badge>
                      )}
                    </Button>
                  )}
                  
                  {/* Profile Dropdown (includes notifications on mobile) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <User className="h-5 w-5" />
                        {unreadNotifications > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                            {unreadNotifications}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-2">
                        <p>{user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.mode === 'buyer' ? 'Buyer' : 'Seller'}
                          {user?.membership === 'premium' && ' • Premium'}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      
                      {/* Notifications in mobile dropdown */}
                      <DropdownMenuItem 
                        onClick={() => {
                          // Toggle notification dropdown or navigate to notifications page
                          window.location.hash = 'notifications';
                        }}
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                        {unreadNotifications > 0 && (
                          <Badge className="ml-auto">{unreadNotifications}</Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => window.location.hash = 'profile'}>
                        My Profile
                      </DropdownMenuItem>
                      
                      {user?.mode === 'buyer' && (
                        <DropdownMenuItem onClick={() => window.location.hash = 'orders'}>
                          My Orders
                        </DropdownMenuItem>
                      )}
                      
                      {user?.mode === 'seller' && (
                        <DropdownMenuItem onClick={() => window.location.hash = 'seller/analytics'}>
                          Analytics
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={() => window.location.hash = 'subscription'}>
                        Membership
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Mode Switching */}
                      {user?.mode === 'buyer' && (
                        <DropdownMenuItem onClick={() => handleModeSwitch('seller')}>
                          Switch to Seller
                        </DropdownMenuItem>
                      )}
                      
                      {user?.mode === 'seller' && (
                        <DropdownMenuItem onClick={() => handleModeSwitch('buyer')}>
                          Switch to Buyer
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleModeSwitch('guest')}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
          
          {/* Bottom Row: Search Bar (Mobile) */}
          {!isGuest && (
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 bg-[#f4f0db] rounded-2xl px-4 py-2">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-20 border-0 bg-transparent text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="fabric">Fabric</SelectItem>
                    <SelectItem value="yarn">Yarn</SelectItem>
                    <SelectItem value="jute">Jute</SelectItem>
                    <SelectItem value="leather">Leather</SelectItem>
                    <SelectItem value="fiber">Fiber</SelectItem>
                  </SelectContent>
                </Select>
                
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm"
                />
                
                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
