// WhatsApp ordering config. Orders are placed by opening a WhatsApp chat
// with the cart contents pre-filled — there is no online checkout/payment.
//
// CHANGE THIS NUMBER to the real business WhatsApp number before going live.
// Format: country code + number, digits only, no "+", no leading 0.
// (Current value is a test number: local 0349 8703301 → intl 92 349 8703301.)
export const WHATSAPP_NUMBER = '923498703301';

const money = (n) => `Rs. ${Number(n).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

// Builds the pre-filled WhatsApp order message from the cart items and opens
// the chat. Items without a price are listed as "Price on request".
export function buildWhatsappOrderUrl(items, subtotal) {
  const lines = items.map((item, i) => {
    const price = item.product?.salePrice ?? item.product?.retailPrice ?? null;
    const priceText = price ? `${money(price * item.quantity)}` : 'Price on request';
    return `${i + 1}. ${item.product?.name} × ${item.quantity} — ${priceText}`;
  });

  const hasUnpriced = items.some((i) => !(i.product?.salePrice ?? i.product?.retailPrice));

  const message =
    `Hello! I'd like to place an order:\n\n` +
    `${lines.join('\n')}\n\n` +
    `Subtotal: ${money(subtotal)}` +
    (hasUnpriced ? '\n(Some items are priced on request — please confirm.)' : '') +
    `\n\nPlease confirm availability, delivery, and the total. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
