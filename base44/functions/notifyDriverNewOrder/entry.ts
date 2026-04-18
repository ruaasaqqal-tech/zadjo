import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (event.type !== 'create') {
      return Response.json({ status: 'skipped' });
    }

    // Log order creation for Driver app to pick up immediately
    console.log(`🚨 NEW ORDER: ${data.id} | ${data.customer_name} | ${data.total} د.أ | Kitchen: ${data.kitchen_name}`);

    // No API call needed — both apps use same WebSocket subscription
    // This function just ensures immediate logging/triggering
    return Response.json({
      status: 'order_notified',
      orderId: data.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});