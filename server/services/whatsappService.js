// Sends the business a WhatsApp notification when an order is placed, via
// CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/).
//
// One-time setup (owner):
//   1. Add the CallMeBot number +34 644 51 95 23 to your phone contacts.
//   2. Send it this WhatsApp message: "I allow callmebot to send me messages"
//   3. It replies with your personal API key.
//   4. Put CALLMEBOT_PHONE (your number, intl digits, e.g. 923498703301) and
//      CALLMEBOT_APIKEY in server/.env.
//
// Until those env vars are set, sending is skipped (logged) so order placement
// still works end-to-end without it.
const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE;
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY;

const money = (n) => `Rs. ${Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

function buildOrderMessage(order) {
  const a = order.address || {};
  const lines = (order.items || []).map(
    (i) => `• ${i.title} x${i.quantity}${i.price ? ` = ${money(i.subtotal)}` : ' (price on request)'}`
  );
  return (
    `🛒 NEW ORDER ${order.orderNumber}\n\n` +
    `Customer: ${order.customerName}\n` +
    `Phone: ${order.customerPhone}\n` +
    `Email: ${order.customerEmail}\n\n` +
    `Address:\n${a.apartment ? a.apartment + ', ' : ''}${a.address_line || ''}\n` +
    `${a.area ? a.area + ', ' : ''}${a.city || ''}, ${a.province || ''} ${a.postal_code || ''}\n\n` +
    `Items:\n${lines.join('\n')}\n\n` +
    `Subtotal: ${money(order.subtotal)}\n` +
    `Shipping: ${money(order.shipping)}\n` +
    `Total: ${money(order.grandTotal)}\n` +
    `Payment: Cash on Delivery` +
    (order.notes ? `\n\nNotes: ${order.notes}` : '')
  );
}

exports.notifyNewOrder = async (order) => {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_APIKEY) {
    console.warn('⚠️ CallMeBot not configured (CALLMEBOT_PHONE/CALLMEBOT_APIKEY) — skipping WhatsApp notification.');
    return;
  }
  const text = buildOrderMessage(order);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(CALLMEBOT_PHONE)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(CALLMEBOT_APIKEY)}`;
  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok) throw new Error(`CallMeBot responded ${res.status}: ${body.slice(0, 120)}`);
  console.log('✅ WhatsApp order notification sent');
};
