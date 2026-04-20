import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Requests browser notification permission and saves a "token" (user_email based)
 * to the DeviceToken entity so the backend can target users.
 */
export function useNotifications(user) {
  useEffect(() => {
    if (!user?.email) return;
    if (!('Notification' in window)) return;

    const register = async () => {
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }
      if (permission !== 'granted') return;

      // Use email as the "token" for browser notifications
      // Check if already registered
      const existing = await base44.entities.DeviceToken.filter({ user_email: user.email });
      // admin = kitchen في هذا التطبيق
      const role = user.role === 'admin' ? 'kitchen' : 'customer';
      if (existing.length === 0) {
        await base44.entities.DeviceToken.create({
          user_email: user.email,
          user_role: role,
          token: user.email,
          platform: 'web'
        });
      } else {
        // Update role if changed
        const rec = existing[0];
        if (rec.user_role !== role) {
          await base44.entities.DeviceToken.update(rec.id, { user_role: role });
        }
      }
    };

    register();
  }, [user?.email]);
}

/**
 * Send a local browser notification (shown immediately in this tab/browser).
 */
export function sendLocalNotification(title, body, icon = '/favicon.ico') {
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, icon });
}