import { useStore } from '../lib/store';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Bell, ShoppingBag, MessageCircle, Radio, UserPlus } from 'lucide-react';

export function NotificationsPage() {
  const { notifications, markNotificationAsRead, clearNotifications } = useStore();
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5" />;
      case 'message':
        return <MessageCircle className="h-5 w-5" />;
      case 'broadcast':
        return <Radio className="h-5 w-5" />;
      case 'follow':
        return <UserPlus className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
  
  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2>Notifications</h2>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      !notification.read ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={!notification.read ? 'font-semibold' : ''}>
                        {notification.content}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
