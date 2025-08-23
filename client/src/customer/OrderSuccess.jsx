import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";

const OrderSuccess = () => {
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    const data = location.state?.orderData;
    if (data) {
      setOrderData(data);
      console.log("Order success data:", data);
    }
  }, [location.state]);

  if (!orderData) {
    // Fallback if no order data (direct navigation)
    return (
      <section className="tomato flex items-center justify-center relative h-screen">
        <div className="absolute myText py-8 px-4 max-w-screen-xl lg:py-16 lg:px-6 bg-white opacity-70 rounded-4xl">
          <div className="mx-auto max-w-screen-sm text-center -mt-[10] z-20">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-green-600">
              Success
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
              Your order has been placed!
            </p>
            <p className="mb-4 text-lg text-gray-900">
              Thank you for your order. We will prepare it and have it ready for
              you shortly.
            </p>
            <Link
              to="/"
              className="inline-flex text-black bg-green-600 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const businessAddress = "2682 S. 156th Dr., Goodyear, AZ 85338";

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Confirmed! 🍕</h1>
          <p className="text-xl text-gray-600">Thank you for choosing OverTheWall™ Pizza</p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          
          {/* Order Number & Status */}
          <div className="text-center border-b pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order #{orderData.orderNumber}
            </h2>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">Order Received</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Estimated ready time: 15-25 minutes
            </p>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {orderData.firstName} {orderData.lastName}</p>
                <p><span className="font-medium">Phone:</span> {orderData.phone}</p>
                {orderData.email && (
                  <p><span className="font-medium">Email:</span> {orderData.email}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Method:</span> {orderData.paymentMethod || 'Cash on Pickup'}</p>
                <p><span className="font-medium">Total:</span> ${Number(orderData.orderTotal).toFixed(2)}</p>
                {orderData.receiptNumber && (
                  <p><span className="font-medium">Receipt #:</span> {orderData.receiptNumber}</p>
                )}
                {orderData.paymentId && (
                  <p><span className="font-medium">Payment ID:</span> {orderData.paymentId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Order</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderData.orderDetails?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm capitalize">{item.pizzaName}</td>
                      <td className="px-4 py-3 text-sm text-center">{item.quantity || 1}</td>
                      <td className="px-4 py-3 text-sm text-right">${Number(item.pizzaPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-3 text-sm" colSpan="2">Total</td>
                    <td className="px-4 py-3 text-sm text-right">${Number(orderData.orderTotal).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">Pickup Location & Instructions</h3>
                <p className="text-blue-700 mb-2">
                  <strong>Address:</strong> {businessAddress}
                </p>
                <p className="text-blue-700 mb-2">
                  <strong>Estimated Ready:</strong> 15-25 minutes from now
                </p>
                <p className="text-blue-600 text-sm">
                  <strong>Important:</strong> Please bring your order number ({orderData.orderNumber}) when picking up. 
                  All orders are pickup only - we do not offer delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          {orderData.email && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-green-700 text-sm">
                  <strong>Email confirmation sent to:</strong> {orderData.email}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/order-menu"
              className="btn-metal btn-metal-green text-center"
            >
              Order More Pizza
            </Link>
            <Link
              to="/"
              className="btn-metal btn-metal-blue text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Print Option */}
        <div className="text-center">
          <button
            onClick={() => window.print()}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
