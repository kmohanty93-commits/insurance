'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  FileText,
  Calendar,
  User
} from 'lucide-react';

type NotificationType = 'info' | 'warning' | 'error' | 'success';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  claim_id: string | null;
  claim_number: string | null;
  action_url: string | null;
  created_at: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: '1',
    title: 'New Claim Assigned',
    message: 'You have been assigned to claim PRO-24-00001: Factory Fire Damage - Building A',
    type: 'info',
    read: false,
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    action_url: '/claims/1',
    created_at: '2024-01-22T10:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    title: 'Task Overdue',
    message: 'Task "Obtain Bill of Lading" for claim MAR-24-00001 is overdue by 5 days',
    type: 'error',
    read: false,
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    action_url: '/workflow',
    created_at: '2024-01-21T09:00:00Z',
  },
  {
    id: '3',
    user_id: '1',
    title: 'Approval Pending',
    message: 'Claim PRO-24-00001 is awaiting your approval at Level 2 (Finance)',
    type: 'warning',
    read: false,
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    action_url: '/approvals',
    created_at: '2024-01-20T14:30:00Z',
  },
  {
    id: '4',
    user_id: '1',
    title: 'Claim Approved',
    message: 'Claim CGL-24-00001 has been fully approved and is ready for settlement',
    type: 'success',
    read: true,
    claim_id: '4',
    claim_number: 'CGL-24-00001',
    action_url: '/claims/4',
    created_at: '2024-01-20T16:00:00Z',
  },
  {
    id: '5',
    user_id: '1',
    title: 'Document Uploaded',
    message: 'New document "surveyor_report.pdf" has been uploaded to claim PRO-24-00001',
    type: 'info',
    read: true,
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    action_url: '/documents',
    created_at: '2024-01-18T14:30:00Z',
  },
  {
    id: '6',
    user_id: '1',
    title: 'Task Completed',
    message: 'Task "Collect fire damage photographs" has been marked as completed',
    type: 'success',
    read: true,
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    action_url: '/workflow',
    created_at: '2024-01-18T15:30:00Z',
  },
  {
    id: '7',
    user_id: '1',
    title: 'Reserve Updated',
    message: 'Reserve for claim PRO-24-00001 has been updated to INR 45,00,000',
    type: 'info',
    read: true,
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    action_url: '/financial',
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '8',
    user_id: '1',
    title: 'New Comment',
    message: 'Sarah Head commented on task "Obtain repair quotations"',
    type: 'info',
    read: true,
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    action_url: '/workflow',
    created_at: '2024-01-19T10:00:00Z',
  },
];

const typeConfig: Record<NotificationType, { color: string; bgColor: string; icon: React.ElementType }> = {
  info: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Info },
  warning: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle },
  error: { color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle },
  success: { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    const matchesReadFilter = filter === 'all' || !n.read;
    const matchesTypeFilter = typeFilter === 'all' || n.type === typeFilter;
    return matchesReadFilter && matchesTypeFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Stay updated on claim activities, tasks, and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-5 h-5" />
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="info">Information</option>
            <option value="warning">Warnings</option>
            <option value="error">Alerts</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map(notification => {
          const config = typeConfig[notification.type];
          const TypeIcon = config.icon;

          return (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all ${
                !notification.read ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <TypeIcon className={`w-5 h-5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        {notification.claim_number && (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                            <FileText className="w-3 h-3" />
                            {notification.claim_number}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {notification.action_url && (
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Details &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Notification Bell Component for Header
interface NotificationBellProps {
  onClick?: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.map(notification => {
                const config = typeConfig[notification.type];
                const TypeIcon = config.icon;

                return (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                      !notification.read ? 'border-l-blue-500 bg-blue-50/50' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded ${config.bgColor}`}>
                        <TypeIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onClick?.();
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
