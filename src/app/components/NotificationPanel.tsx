import { Bell, X, Check, MessageCircle, Heart, Calendar, Info, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCurrentPage, setSelectedStoryId } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'update':
        return <BookOpen className="w-5 h-5" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5" />;
      case 'like':
        return <Heart className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'system':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'update':
        return 'from-blue-600 to-blue-700';
      case 'comment':
        return 'from-green-600 to-green-700';
      case 'like':
        return 'from-red-600 to-red-700';
      case 'event':
        return 'from-yellow-600 to-yellow-700';
      case 'system':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markNotificationRead(notification.id);
    if (notification.link) {
      setCurrentPage(notification.link.page);
      if (notification.link.id) {
        setSelectedStoryId(notification.link.id);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed top-20 right-0 w-full max-w-md h-[calc(100vh-80px-112px)] bg-slate-900/98 backdrop-blur-xl border-l-4 border-yellow-400 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="relative border-b-2 border-yellow-400/30 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
          <div className="p-4 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center border-2 border-yellow-400">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-xl text-white tracking-tight">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs font-bold text-yellow-400">{unreadCount} unread</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-slate-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 border-blue-400"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No notifications yet</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${notification.read 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-yellow-400 hover:border-yellow-300 shadow-lg shadow-yellow-500/20'
                  }
                `}
              >
                {!notification.read && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                )}
                
                <div className="flex gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getColor(notification.type)} rounded-lg flex items-center justify-center border-2 border-white/20 flex-shrink-0`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white text-sm mb-1">{notification.title}</h3>
                    <p className="text-xs text-slate-300 mb-2 line-clamp-2">{notification.message}</p>
                    <p className="text-xs font-bold text-slate-500">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
