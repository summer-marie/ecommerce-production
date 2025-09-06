import { withRetry } from "./emailRetry.js";
import { getOrCreateOperatingDoc } from "../operatingHours/operatingModel.js";
import sgMail from "@sendgrid/mail";

/**
 * Send an admin alert when a new order is created.
 * Uses SendGrid transport. Non-blocking: caller should wrap in try/catch.
 */
export async function sendAdminNewOrderEmail(order) {
  // Feature flag: allow disabling admin alerts in some environments
  if (String(process.env.EMAIL_ADMIN_ON_NEW_ORDER || "true").toLowerCase() !== "true") {
    return { sent: false, reason: "Feature flag disabled" };
  }
  // Use dynamic recipients from DB settings (Admin dashboard > Operating Hours)
  const cfg = await getOrCreateOperatingDoc();
  const to = (cfg.adminAlertEmails || []).filter(Boolean);
  if (!to || to.length === 0) {
    console.warn("Admin alert email skipped: no recipients configured in Operating Hours settings (adminAlertEmails)");
    return { sent: false, reason: "No recipient configured in DB" };
  }

  const fromName = process.env.BUSINESS_NAME || "OverTheWall™ Pizza";
  const subject = `New Order #${order.orderNumber} received`;

  // Basic summary
  const customer = `${order.firstName || ""} ${order.lastName || ""}`.trim();
  const phone = order.phone || "N/A";
  const total = Number(order.orderTotal || 0).toFixed(2);
  const createdAt = new Date(order.date || Date.now()).toLocaleString();

  const lines = Array.isArray(order.orderDetails)
    ? order.orderDetails.map((it) => `- ${it.pizzaName} x${it.quantity || 1} — $${Number(it.pizzaPrice).toFixed(2)}`)
    : [];

  const text = `New order received\n\nOrder #: ${order.orderNumber}\nWhen: ${createdAt}\nCustomer: ${customer}\nPhone: ${phone}\nTotal: $${total}\n\nItems:\n${lines.join("\n")}`;

  // Branded HTML to mirror your SendGrid style blocks
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; background:#ffffff;">
      <div style="text-align: center; margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
        <h1 style="color: #2563eb; margin: 0;">${fromName}</h1>
        <h2 style="color: #dc2626; margin: 10px 0;">New Order Received</h2>
        <p style="font-size: 16px; font-weight: bold; margin: 0;">Order #${order.orderNumber}</p>
      </div>

      <div style="margin-bottom: 18px;">
        <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px;">Summary</h3>
        <p style="margin: 4px 0;"><strong>When:</strong> ${createdAt}</p>
        <p style="margin: 4px 0;"><strong>Customer:</strong> ${customer || "N/A"}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
        <p style="margin: 4px 0;"><strong>Total:</strong> $${total}</p>
      </div>

      <div style="margin-bottom: 18px;">
        <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px;">Items</h3>
        <ul style="margin:8px 0 0 18px; padding:0;">
          ${lines.map((l) => `<li style=\"margin:4px 0;\">${l.replace("- ", "")}</li>`).join("")}
        </ul>
      </div>

      <div style="text-align: center; padding: 12px; background-color: #f3f4f6; border-radius: 8px; color: #6b7280;">
        <p style="margin: 0; font-size: 13px;">You are receiving this alert because admin notifications are enabled.</p>
      </div>
    </body>
    </html>
  `;

  // Choose transport: SendGrid if configured or requested, else Gmail SMTP
  // SendGrid-only path (no Gmail fallback)
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Admin alert email skipped: SENDGRID_API_KEY not configured");
    return { sent: false, reason: "SendGrid not configured" };
  }
  const from = process.env.SENDGRID_FROM_EMAIL || "noreply@overthewallpizza.com";
  const mail = { to, from, subject, text, html };
  return withRetry(async () => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const result = await sgMail.send(mail);
    return { sent: true, messageId: result[0]?.headers?.["x-message-id"] };
  }, { retries: 2, baseDelay: 600 });
}
