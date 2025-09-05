import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types';

interface NotificationsPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const formatDistanceToNow = (date: number): string => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `${Math.floor(seconds)}s ago`;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkAsRead, onMarkAllAsRead }) => {
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        onClose();
    };

    const hasUnread = notifications.some(n => !n.isRead);

    return (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border z-50">
            <div className="p-3 flex justify-between items-center border-b">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                {hasUnread && (
                    <button onClick={onMarkAllAsRead} className="text-xs text-blue-600 hover:underline font-semibold">
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="p-3 border-b hover:bg-gray-100 cursor-pointer flex items-start gap-3"
                        >
                            {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                            )}
                            <div className={`flex-grow ${notification.isRead ? 'pl-5' : ''}`}>
                                <p className="font-semibold text-gray-800 text-sm">{notification.title}</p>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(notification.createdAt)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-10 text-center text-sm text-gray-500">You have no new notifications.</p>
                )}
            </div>
        </div>
    );
};
