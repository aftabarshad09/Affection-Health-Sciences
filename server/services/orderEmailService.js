const transporter = require('../config/emailConfig');
const {
  orderConfirmationEmail,
  orderStatusChangedEmail,
  adminNewOrderEmail,
  adminOrderCancelledEmail,
  adminNewCustomerEmail,
} = require('../lib/mailer/orderTemplates');

const FROM = process.env.EMAIL_USER;
const ADMIN_TO = process.env.RECEIVER_EMAIL;

function customerEmailFor(order) {
  // Guest orders carry the customer's email directly on the order.
  return order.customerEmail || null;
}

exports.notifyOrderPlaced = async (order) => {
  const to = await customerEmailFor(order);
  if (!to) return;
  await transporter.sendMail({
    from: `"Affection Health Sciences" <${FROM}>`,
    to,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: orderConfirmationEmail(order),
  });
};

exports.notifyOrderStatusChanged = async (order) => {
  const to = await customerEmailFor(order);
  if (!to) return;
  await transporter.sendMail({
    from: `"Affection Health Sciences" <${FROM}>`,
    to,
    subject: `Order ${order.orderNumber} — ${order.orderStatus.replace(/_/g, ' ')}`,
    html: orderStatusChangedEmail(order),
  });
};

exports.notifyAdminNewOrder = async (order) => {
  if (!ADMIN_TO) return;
  await transporter.sendMail({
    from: `"Affection Health Sciences" <${FROM}>`,
    to: ADMIN_TO,
    subject: `New Order — ${order.orderNumber}`,
    html: adminNewOrderEmail(order),
  });
};

exports.notifyAdminOrderCancelled = async (order) => {
  if (!ADMIN_TO) return;
  await transporter.sendMail({
    from: `"Affection Health Sciences" <${FROM}>`,
    to: ADMIN_TO,
    subject: `Order Cancelled — ${order.orderNumber}`,
    html: adminOrderCancelledEmail(order),
  });
};

exports.notifyAdminNewCustomer = async (profile) => {
  if (!ADMIN_TO) return;
  await transporter.sendMail({
    from: `"Affection Health Sciences" <${FROM}>`,
    to: ADMIN_TO,
    subject: `New Customer — ${profile.fullName || profile.email}`,
    html: adminNewCustomerEmail(profile),
  });
};
