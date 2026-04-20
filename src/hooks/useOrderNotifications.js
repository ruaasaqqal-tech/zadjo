import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { sendLocalNotification } from './useNotifications';

/**
 * Subscribes to NotificationQueue in real-time.
 * When a new notification arrives for the user's role/email,
 * shows a browser notification and marks it as read.
 */
export function useOrderNotifications(user) {
  const seenIds = useRef(new Set());

  useEffect(() => {
    if (!user?.email) return;
    if (Notification.permission !== 'granted') return;

    // Map role: admin=kitchen في هذا التطبيق، وdriver هو route منفصل
    const userRole = user.role === 'admin' ? 'kitchen' : 'customer';

    const unsubscribe = base44.entities.NotificationQueue.subscribe(async (event) => {
      if (event.type !== 'create') return;
      const notif = event.data;
      if (!notif) return;
      if (seenIds.current.has(event.id)) return;
      seenIds.current.add(event.id);

      const isForMe =
        notif.target_role === userRole ||
        (notif.target_email && notif.target_email === user.email);

      if (!isForMe) return;

      // Show browser notification
      sendLocalNotification(notif.title, notif.message);

      // Mark as read
      base44.entities.NotificationQueue.update(event.id, { read: true });
    });

    return () => unsubscribe();
  }, [user?.email, user?.role]);
}