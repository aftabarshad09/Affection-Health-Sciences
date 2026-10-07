const transporter = require('../config/emailConfig');
const db = require('../lib/db');
const {
  orderConfirmationEmail,
  orderStatusChangedEmail,
  adminNewOrderEmail,
  adminOrderCancelledEmail,
  adminNewCustomerEmail,
} = require('../lib/mailer/orderTemplates');

const FROM = process.env.EMAIL_USER;
const ADMIN_TO = process.env.RECEIVER_EMAIL;

async function customerEmailFor(order) {
  // Guest orders carry the email directly; logged-in orders (legacy) fall
  // back to the profile.
  if (order.customerEmail) return order.customerEmail;
  if (order.userId) {
    const profile = await db.profiles.getById(order.userId);
    return profile?.email;
  }
  return null;
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
