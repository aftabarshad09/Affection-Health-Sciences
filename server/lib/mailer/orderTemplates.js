const { wrapEmail } = require('./baseTemplate');

const money = (n) => `Rs. ${Number(n).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

const itemsTable = (items) => `
  <table class="items">
    <thead><tr><th>Product</th><th>Qty</th><th style="text-align:right;">Subtotal</th></tr></thead>
    <tbody>
      ${items.map((i) => `<tr><td>${i.title}</td><td>${i.quantity}</td><td style="text-align:right;">${i.price ? money(i.subtotal) : 'Price on request'}</td></tr>`).join('')}
    </tbody>
  </table>
`;

const totalsTable = (order) => `
  <table class="totals" width="100%">
    <tr><td>Subtotal</td><td style="text-align:right;">${money(order.subtotal)}</td></tr>
    <tr><td>Shipping</td><td style="text-align:right;">${money(order.shipping)}</td></tr>
    ${order.tax > 0 ? `<tr><td>Tax</td><td style="text-align:right;">${money(order.tax)}</td></tr>` : ''}
    <tr class="grand"><td>Grand Total</td><td style="text-align:right;">${money(order.grandTotal)}</td></tr>
  </table>
`;

const addressBlock = (address) => `
  <p style="color:#555;">
    ${address.receiver_name} — ${address.phone}<br/>
    ${address.apartment ? `${address.apartment}, ` : ''}${address.address_line}, ${address.area ? `${address.area}, ` : ''}${address.city}, ${address.province} ${address.postal_code || ''}
  </p>
`;

function orderConfirmationEmail(order) {
  return wrapEmail({
    title: `Order Confirmation — ${order.orderNumber}`,
    preheader: `Your order ${order.orderNumber} has been placed.`,
    bodyHtml: `
      <h2>Thank you for your order!</h2>
      <p>We've received your order <strong>${order.orderNumber}</strong> and it's now <span class="badge">${order.orderStatus}</span>.</p>
      ${itemsTable(order.items || [])}
      ${totalsTable(order)}
      <h2 style="margin-top:24px;">Delivery Address</h2>
      ${addressBlock(order.address)}
      <p>Payment Method: <strong>Cash on Delivery</strong></p>
      <p>We'll email you every time your order's status changes.</p>
    `,
  });
}

const STATUS_COPY = {
  confirmed: 'Your order has been confirmed and is being prepared.',
  packed: 'Your order has been packed and is ready for dispatch.',
  shipped: 'Your order is on its way!',
  out_for_delivery: 'Your order is out for delivery — it should arrive soon.',
  delivered: 'Your order has been delivered. We hope you love it!',
  cancelled: 'Your order has been cancelled.',
  returned: 'Your order has been marked as returned.',
};

function orderStatusChangedEmail(order) {
  const copy = STATUS_COPY[order.orderStatus] || 'Your order status has been updated.';
  return wrapEmail({
    title: `Order ${order.orderNumber} — ${order.orderStatus.replace(/_/g, ' ')}`,
    preheader: copy,
    bodyHtml: `
      <h2>Order ${order.orderNumber}</h2>
      <p>${copy}</p>
      <p>Status: <span class="badge">${order.orderStatus.replace(/_/g, ' ')}</span></p>
      ${order.items ? itemsTable(order.items) : ''}
      ${totalsTable(order)}
      <h2 style="margin-top:24px;">Delivery Address</h2>
      ${addressBlock(order.address)}
    `,
  });
}

function adminNewOrderEmail(order) {
  return wrapEmail({
    title: `New Order — ${order.orderNumber}`,
    bodyHtml: `
      <h2>New order received</h2>
      <p>Order <strong>${order.orderNumber}</strong> — ${money(order.grandTotal)} (COD)</p>
      ${itemsTable(order.items || [])}
      ${totalsTable(order)}
      <h2 style="margin-top:24px;">Delivery Address</h2>
      ${addressBlock(order.address)}
    `,
  });
}

function adminOrderCancelledEmail(order) {
  return wrapEmail({
    title: `Order Cancelled — ${order.orderNumber}`,
    bodyHtml: `
      <h2>Order cancelled</h2>
      <p>Order <strong>${order.orderNumber}</strong> (${money(order.grandTotal)}) has been cancelled.</p>
      ${addressBlock(order.address)}
    `,
  });
}

function adminNewCustomerEmail(profile) {
  return wrapEmail({
    title: 'New Customer Registered',
    bodyHtml: `
      <h2>New customer registered</h2>
      <p><strong>${profile.fullName || profile.full_name || 'A new customer'}</strong> (${profile.email}) just created an account.</p>
    `,
  });
}

module.exports = {
  orderConfirmationEmail,
  orderStatusChangedEmail,
  adminNewOrderEmail,
  adminOrderCancelledEmail,
  adminNewCustomerEmail,
};
