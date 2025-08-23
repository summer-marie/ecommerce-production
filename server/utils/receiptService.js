import sgMail from "@sendgrid/mail";

/**
 * Send order confirmation/receipt email to customer
 * @param {Object} orderData - Order information
 * @param {Object} paymentData - Payment/receipt information from Square
 */
export const sendOrderConfirmationEmail = async (orderData, paymentData = null) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("SendGrid not configured - skipping receipt email");
      return { sent: false, reason: "SendGrid not configured" };
    }

    // Set API key for each request to ensure it's properly loaded
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("🐛 DEBUG - Using SendGrid API key:", process.env.SENDGRID_API_KEY?.substring(0, 10) + "...");

    const {
      firstName,
      lastName,
      phone,
      orderDetails,
      orderTotal,
      orderNumber,
      address
    } = orderData;

    const customerEmail = orderData.email || orderData.customerEmail;
    
    if (!customerEmail) {
      console.warn("No customer email provided - cannot send receipt");
      return { sent: false, reason: "No customer email" };
    }

    // Business details
    const businessName = "OverTheWall™ Pizza";
    const businessAddress = "2682 S. 156th Dr., Goodyear, AZ 85338";
    const businessPhone = process.env.BUSINESS_PHONE || "Contact via website";

    // Email configuration
    const from = process.env.SENDGRID_FROM_EMAIL || "noreply@overthewallpizza.com";
    const to = customerEmail;

    // Generate order summary
    const orderItemsHtml = orderDetails.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.pizzaName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.pizzaPrice).toFixed(2)}</td>
      </tr>
    `).join('');

    // Payment method display
    let paymentMethodText = "Cash on Pickup";
    let receiptInfo = "";
    
    if (paymentData && paymentData.method === "square") {
      paymentMethodText = paymentData.wallet === "googlePay" ? "Google Pay" : "Credit/Debit Card";
      if (paymentData.receiptNumber) {
        receiptInfo = `
          <p style="margin: 10px 0;"><strong>Receipt #:</strong> ${paymentData.receiptNumber}</p>
          <p style="margin: 10px 0;"><strong>Payment ID:</strong> ${paymentData.paymentId}</p>
        `;
      }
    }

    // Email subject
    const subject = `Order Confirmation #${orderNumber} - ${businessName}`;

    // HTML email template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h1 style="color: #2563eb; margin: 0;">${businessName}</h1>
          <h2 style="color: #059669; margin: 10px 0;">Order Confirmed! 🍕</h2>
          <p style="font-size: 18px; font-weight: bold; margin: 0;">Order #${orderNumber}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Customer Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${address && address.street ? `<p><strong>Address:</strong> ${address.street}, ${address.city}, ${address.state} ${address.zip}</p>` : ''}
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #d1d5db;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #d1d5db;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #d1d5db;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
              <tr style="font-weight: bold; background-color: #f9fafb;">
                <td style="padding: 12px; border-top: 2px solid #d1d5db;" colspan="2">Total</td>
                <td style="padding: 12px; text-align: right; border-top: 2px solid #d1d5db;">$${Number(orderTotal).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Payment Information</h3>
          <p><strong>Payment Method:</strong> ${paymentMethodText}</p>
          <p><strong>Amount Paid:</strong> $${Number(orderTotal).toFixed(2)}</p>
          ${receiptInfo}
        </div>

        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1e40af; margin-top: 0;">📍 Pickup Information</h3>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${businessAddress}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${businessPhone}</p>
          <p style="margin: 5px 0;"><strong>Estimated Ready Time:</strong> 15-25 minutes</p>
          <p style="font-size: 14px; color: #1e40af; margin: 10px 0 0 0;">
            <strong>Important:</strong> All orders are pickup only. Please bring this confirmation or your order number.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; background-color: #f3f4f6; border-radius: 8px; color: #6b7280;">
          <p style="margin: 0; font-size: 14px;">Thank you for choosing ${businessName}!</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">Questions? Contact us through our website.</p>
        </div>

      </body>
      </html>
    `;

    // Plain text version
    const text = `
Order Confirmation #${orderNumber} - ${businessName}

Customer: ${firstName} ${lastName}
Phone: ${phone}
${address && address.street ? `Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}` : ''}

Order Details:
${orderDetails.map(item => `- ${item.pizzaName} (${item.quantity || 1}x) - $${Number(item.pizzaPrice).toFixed(2)}`).join('\n')}

Total: $${Number(orderTotal).toFixed(2)}
Payment: ${paymentMethodText}
${paymentData?.receiptNumber ? `Receipt #: ${paymentData.receiptNumber}` : ''}

PICKUP INFORMATION:
Location: ${businessAddress}
Phone: ${businessPhone}
Estimated Ready: 15-25 minutes

Important: All orders are pickup only. Please bring this confirmation.

Thank you for choosing ${businessName}!
    `;

    const mailOptions = {
      to,
      from,
      subject,
      text,
      html
    };

    console.log(`Sending order confirmation email to ${customerEmail} for order #${orderNumber}`);
    
    const result = await sgMail.send(mailOptions);
    const messageId = result[0]?.headers?.["x-message-id"] || "sent";
    
    console.log(`✅ Order confirmation email sent successfully: ${messageId}`);
    
    return {
      sent: true,
      messageId,
      customerEmail,
      orderNumber
    };

  } catch (error) {
    console.error("Failed to send order confirmation email:", error.message);
    console.error("Error details:", error);
    
    return {
      sent: false,
      error: error.message,
      customerEmail: orderData.email || orderData.customerEmail,
      orderNumber: orderData.orderNumber
    };
  }
};

/**
 * Send simple payment receipt email (for card payments)
 * @param {Object} receiptData - Receipt data from Square
 * @param {string} customerEmail - Customer email address
 */
export const sendPaymentReceiptEmail = async (receiptData, customerEmail) => {
  try {
    if (!process.env.SENDGRID_API_KEY || !customerEmail) {
      return { sent: false, reason: "SendGrid not configured or no email" };
    }

    // Set API key for each request to ensure it's properly loaded
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("🐛 DEBUG - Payment receipt using SendGrid API key:", process.env.SENDGRID_API_KEY?.substring(0, 10) + "...");

    const businessName = "OverTheWall™ Pizza";
    const from = process.env.SENDGRID_FROM_EMAIL || "noreply@overthewallpizza.com";

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #059669;">Payment Receipt</h2>
          <p style="color: #6b7280;">From ${businessName}</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
          <p><strong>Receipt #:</strong> ${receiptData.receiptNumber}</p>
          <p><strong>Payment ID:</strong> ${receiptData.paymentId}</p>
          <p><strong>Amount:</strong> $${Number(receiptData.amount).toFixed(2)}</p>
          <p><strong>Method:</strong> ${receiptData.method || 'Credit/Debit Card'}</p>
          <p><strong>Status:</strong> ${receiptData.status}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>Keep this receipt for your records</p>
        </div>
      </body>
      </html>
    `;

    const result = await sgMail.send({
      to: customerEmail,
      from,
      subject: `Payment Receipt - ${businessName}`,
      html,
      text: `Payment Receipt\nReceipt #: ${receiptData.receiptNumber}\nAmount: $${receiptData.amount}\nPayment ID: ${receiptData.paymentId}`
    });

    return { sent: true, messageId: result[0]?.headers?.["x-message-id"] };

  } catch (error) {
    console.error("Failed to send payment receipt:", error);
    return { sent: false, error: error.message };
  }
};
