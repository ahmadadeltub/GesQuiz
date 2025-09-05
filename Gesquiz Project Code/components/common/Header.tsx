import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, Notification as NotificationType } from '../../types';
import { mockDbService } from '../../services/mockDbService';
import { NotificationsPanel } from './NotificationsPanel';
import { useLanguage, useTranslation } from '../../i18n';

const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const LanguageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 13-4-4-4 4M19 17v-2a4 4 0 00-4-4H9M19 17h-2a2 2 0 01-2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2z" /></svg>;

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={switcherRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center gap-2 text-gray-500 hover:text-primary-light focus:outline-none"
                aria-label="Change language"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <LanguageIcon />
                <span className="font-semibold">{language.toUpperCase()}</span>
            </button>
            {isOpen && (
                <div className="absolute top-full end-0 mt-2 w-36 bg-white rounded-lg shadow-2xl border z-50">
                    <ul>
                        <li>
                            <button onClick={() => { setLanguage('en'); setIsOpen(false); }} className="w-full text-start px-4 py-2 hover:bg-gray-100">English</button>
                        </li>
                        <li>
                            <button onClick={() => { setLanguage('ar'); setIsOpen(false); }} className="w-full text-start px-4 py-2 hover:bg-gray-100">العربية</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};


export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (user) {
          setNotifications(mockDbService.getNotificationsForUser(user.id));
      } else {
          setNotifications([]);
      }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    if (!user) return;
    mockDbService.markNotificationAsRead(notificationId, user.id);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };
  
  const handleMarkAllAsRead = () => {
    if (!user) return;
    mockDbService.markAllNotificationsAsRead(user.id);
    setNotifications(prev => prev.map(n => ({...n, isRead: true })));
  };

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  let dashboardPath = '/';
  if (user) {
    if (user.role === UserRole.TEACHER) dashboardPath = '/teacher';
    else if (user.role === UserRole.STUDENT) dashboardPath = '/student';
    else if (user.role === UserRole.ADMIN) dashboardPath = '/admin';
    else if (user.role === UserRole.SUPER_ADMIN) dashboardPath = '/superadmin';
  }


  return (
    <header className="bg-white shadow-md relative z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center" aria-label="Main navigation">
        <Link to="/" className="text-2xl font-bold text-primary">
          <span role="img" aria-label="hand wave">👋</span> {t('gesquiz')}
        </Link>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {user ? (
            <>
              <div className="flex items-center gap-4" ref={panelRef}>
                <div className="relative">
                    <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="text-gray-500 hover:text-primary-light focus:outline-none" aria-label={`${t('viewNotifications')} (${unreadCount} unread)`} aria-haspopup="true" aria-expanded={isPanelOpen}>
                        <BellIcon />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center" aria-hidden="true">{unreadCount}</span>
                            </span>
                        )}
                    </button>
                    {isPanelOpen && (
                        <NotificationsPanel 
                            notifications={notifications}
                            onClose={() => setIsPanelOpen(false)}
                            onMarkAsRead={handleMarkAsRead}
                            onMarkAllAsRead={handleMarkAllAsRead}
                        />
                    )}
                </div>
                <span className="text-gray-700 hidden sm:inline" aria-label={`Logged in as ${user.firstName} ${user.lastName}`}>{t('welcome')}, {user.firstName} {user.lastName}</span>
                 <Link to={dashboardPath} className="font-semibold text-gray-600 hover:text-primary-dark transition duration-300">
                    {t('dashboard')}
                 </Link>
                 <button
                    onClick={handleLogout}
                    className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark transition duration-300 font-semibold"
                >
                    {t('logout')}
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold text-gray-600 hover:text-primary-dark transition duration-300">
                {t('login')}
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition duration-300 font-semibold"
              >
                {t('signup')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
