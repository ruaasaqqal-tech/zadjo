import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Called by entity automation when an Order status changes.
 * Reads DeviceTokens for the target role and sends a browser notification
 * via the Web Push / Notification API by storing the message in a
 * NotificationQueue entity so the frontend can pick it up in real-time.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { event, data, old_data } = body;

    if (!data) {
      return Response.json({ ok: true, skipped: 'no data' });
    }

    const status = data.status;
    const oldStatus = old_data?.status;

    // Only act on status changes
    if (status === oldStatus) {
      return Response.json({ ok: true, skipped: 'status unchanged' });
    }

    let targetRole = null;
    let title = '';
    let message = '';

    // Order statuses: 'تم الطلب' | 'قيد التحضير' | 'في الطريق' | 'تم التوصيل' | 'ملغي'
    if (event?.type === 'create') {
      // New order → notify kitchen
      targetRole = 'kitchen';
      title = '🍽️ طلب جديد!';
      message = `طلب جديد من ${data.customer_name || 'عميل'} — ${data.total?.toFixed(2)} د.أ`;
    } else if (status === 'قيد التحضير' && oldStatus === 'تم الطلب') {
      // Kitchen started preparing → notify drivers
      targetRole = 'driver';
      title = '🚗 طلب جاهز للاستلام!';
      message = `طلب من ${data.kitchen_name || 'المطبخ'} جاهز للتوصيل`;
    } else if (status === 'في الطريق' && oldStatus === 'قيد التحضير') {
      // Driver picked up → notify customer
      targetRole = 'customer';
      title = '🚗 طلبك بالطريق!';
      message = 'المندوب في طريقه إليك، استعد للاستلام';
    } else if (status === 'تم التوصيل') {
      // Delivered → notify customer
      targetRole = 'customer';
      title = '✅ تم توصيل طلبك!';
      message = 'تم توصيل طلبك بنجاح، بالعافية!';
    }

    if (!targetRole) {
      return Response.json({ ok: true, skipped: 'no matching status transition' });
    }

    // Store notification in queue — frontend will pick it up via subscription
    await base44.asServiceRole.entities.NotificationQueue.create({
      target_role: targetRole,
      target_email: targetRole === 'customer' ? (data.created_by || '') : null,
      order_id: data.id || event?.entity_id,
      title,
      message,
      read: false
    });

    return Response.json({ ok: true, targetRole, title, message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});