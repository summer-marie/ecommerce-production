// TODO: Add month/year filter and pagination for archived orders in the admin frontend for easier navigation and record-keeping. Keep at least 1 year of archived orders for tax purposes.

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  orderGetArchived,
  getCleanupPreview,
  cleanupArchivedOrders,
} from "../redux/orderSlice";
import AlertBlack from "../components/AlertBlack";

const AdminArchivedOrders = () => {
  const { orders, cleanup } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [showCleanupDetails, setShowCleanupDetails] = useState(false);
  const [showCleanupAlert, setShowCleanupAlert] = useState(false);

  // Grab orders and cleanup preview
  useEffect(() => {
    dispatch(orderGetArchived());
    dispatch(getCleanupPreview());
  }, [dispatch]);

  const getStatusCounts = () => {
    return orders.reduce(
      (counts, order) => {
        if (order.status === "archived") {
          counts.archived++;
        }
        return counts;
      },
      {
        archived: 0,
      }
    );
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleManualCleanup = () => {
    // Show custom alert instead of browser confirm
    setShowCleanupAlert(true);
  };

  const handleCleanupConfirm = async () => {
    setShowCleanupAlert(false);
    dispatch(cleanupArchivedOrders()).then(() => {
      // Refresh the orders list after cleanup
      dispatch(orderGetArchived());
      dispatch(getCleanupPreview());
    });
  };

  const handleCleanupCancel = () => {
    setShowCleanupAlert(false);
  };

  const toggleCleanupDetails = () => {
    setShowCleanupDetails(!showCleanupDetails);
  };

  return (
    <>
      <div className="px-4">
        <div className="flex justify-between items-center mt-5">
          <h2 className="berkshireSwashFont text-2xl font-bold text-slate-800">
            Archived Orders Database
          </h2>
          <div className="flex gap-4">
            {Object.entries(getStatusCounts()).map(([status, count]) => (
              <div
                key={status}
                className="px-4 py-2 rounded-full font-semibold bg-gray-100 text-gray-800 border-gray-800 border-2"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
              </div>
            ))}
          </div>
        </div>
        <hr className="sm:mx-auto lg:my-8 border-gray-700 " />

        {/* Archived Orders Retention Policy */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Archived Orders Retention Policy
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  • <strong>Automatic cleanup:</strong> Archived orders older
                  than 30 days are automatically deleted from the database
                </p>
                <p>
                  • <strong>Cleanup schedule:</strong> Daily cleanup runs at
                  2:00 AM to maintain optimal database performance
                </p>
                <p>
                  • <strong>Tax compliance:</strong> Keep archived orders for at
                  least 1 year before allowing automatic deletion
                </p>
                <p>
                  • <strong>Manual cleanup:</strong> Admins can trigger
                  immediate cleanup via the API if needed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Cleanup Controls */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Database Cleanup Controls
                </h3>
                <div className="text-xs text-slate-600">
                  {cleanup?.preview ? (
                    <>
                      <span>
                        📊 {cleanup.preview.eligibleForDeletion} orders ready
                        for deletion (30+ days old)
                      </span>
                      <span className="ml-4">
                        📋 {cleanup.preview.recentArchived} recent archived
                        orders (kept)
                      </span>
                    </>
                  ) : (
                    <span>Loading cleanup preview...</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleCleanupDetails}
                className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
              >
                {showCleanupDetails ? "Hide Details" : "Show Details"}
              </button>
              <button
                onClick={handleManualCleanup}
                disabled={
                  cleanup?.loading ||
                  cleanup?.preview?.eligibleForDeletion === 0
                }
                className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cleanup?.loading ? "Processing..." : "Manual Cleanup"}
              </button>
            </div>
          </div>

          {showCleanupDetails && (
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <div className="text-xs text-slate-600 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">
                      Cleanup Schedule
                    </h4>
                    <p>• Runs automatically daily at 2:00 AM</p>
                    <p>• Targets orders archived 30+ days ago</p>
                    <p>• Maintains database performance</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1">
                      Current Status
                    </h4>
                    {cleanup?.lastCleanupResult ? (
                      <>
                        <p>
                          • Last cleanup:{" "}
                          {cleanup.lastCleanupResult.deletedCount} orders
                          removed
                        </p>
                        <p>
                          • Status:{" "}
                          {cleanup.lastCleanupResult.success
                            ? "✅ Success"
                            : "❌ Failed"}
                        </p>
                      </>
                    ) : (
                      <p>• No recent manual cleanup performed</p>
                    )}
                    {cleanup?.error && (
                      <p className="text-red-600">• Error: {cleanup.error}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          id="openOrdersTAble"
          className="w-full shadow-2xl overflow-x-auto mb-16"
        >
          <table
            className="w-full mt-1 text-sm text-left rtl:text-right rounded-2xl
        text-gray-500"
          >
            <thead
              className="text-xs uppercase 
          bg-gray-400
          text-teal-950"
            >
              <tr>
                <th scope="col" className="px-4 py-4">
                  {/* **Order ID** */}
                  Order Number
                </th>

                <th scope="col" className="px-4 py-4">
                  {/* **Items in Order (Product Name, Quantity)** */}
                  Order Details/Quantity
                </th>
                <th scope="col" className="px-4 py-4">
                  {/* **Customer Email Address** */}
                  Customer Email
                </th>
                <th scope="col" className="px-4 py-4">
                  {/* **Name (or User Email)** */}
                  Customer Name
                </th>
                <th scope="col" className="px-4 py-4">
                  {/* **Total Price** */}
                  Total $
                </th>
                <th scope="col" className="px-4 py-4">
                  {/* Is order completed && archived */}
                  Status
                </th>
                <th scope="col" className="px-4 py-4">
                  {/* **Order Date** */}
                  Date/Time Order
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className=" border-b px-4 py-4
              odd:bg-stone-200
              even:bg-gray-300 
              border-gray-500"
                >
                  <th
                    scope="row"
                    className="px-4 py-3
                font-medium 
                text-gray-900   "
                  >
                    <p className="">{order.orderNumber}</p>
                  </th>

                  <td className="px-4 py-4">
                    <ul>
                      {Array.isArray(order.orderDetails) ? (
                        order.orderDetails.map((item, idx) => (
                          <li key={idx}>
                            {item.pizzaName} - ${item.pizzaPrice} - QTY:{" "}
                            {item.quantity}
                          </li>
                        ))
                      ) : order.orderDetails ? (
                        <li>
                          {order.orderDetails.pizzaName} - $
                          {order.orderDetails.pizzaPrice} - QTY:{" "}
                          {order.orderDetails.quantity}
                        </li>
                      ) : (
                        <li>No items</li>
                      )}
                    </ul>
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    {order.email || "(Unavailable)"}
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    {" "}
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    $ {order.orderTotal}
                  </td>
                  <td className="px-4 py-4 text-gray-900 uppercase">
                    {order.status}
                  </td>
                  <td className="px-4 py-4">
                    <p className="line-clamp-3 text-gray-900">
                      {formatDate(order.date)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Cleanup Confirmation Alert */}
      {showCleanupAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <AlertBlack
            alertMsg="Delete Old Archived Orders?"
            alertDescription={`This will permanently delete ${cleanup?.preview?.eligibleForDeletion || 0} archived orders older than 30 days. This action cannot be undone and is recommended for database maintenance.`}
            handleConfirm={handleCleanupConfirm}
            handleCancel={handleCleanupCancel}
          />
        </div>
      )}
    </>
  );
};

export default AdminArchivedOrders;
