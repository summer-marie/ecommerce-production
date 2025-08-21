import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AlertBlack from "../components/AlertBlack";
import {
  orderGetOpen,
  orderUpdateStatus,
  orderArchiveOne,
} from "../redux/orderSlice";



// TODO: update status doesnt work
// TODO: archive doesnt work
//  TODO: remove all cancled orders that are 12 hours old 
// TODO: implement order search and filtering
// TODO: add pagination for order list 


const AdminOpenOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [archiveOrder, setArchiveOrder] = useState(null);

  const alertMsg = archiveOrder
    ? (
      <>
        Are you sure you want to archive order #{" "}
        <span className="text-red-500 font-bold">{archiveOrder.orderNumber}</span> ?
      </>
    )
    : "Are you sure you want to archive this order?";
  const alertDescription = "Click to confirm";

  const statusArray = ["processing", "completed", "cancelled"];

  // Grab open order
  useEffect(() => {
    dispatch(orderGetOpen());
  }, [dispatch]);

  const getStatusCounts = () => {
    return orders.reduce(
      (counts, order) => {
        if (order.status in counts) {
          counts[order.status]++;
        }
        return counts;
      },
      {
        processing: 0,
        completed: 0,
        cancelled: 0,
      }
    );
  };
  const getSortedOrders = () => {
    // Sort by newest first
    return [...orders].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  // Separate orders by status
  const getOrdersByStatus = () => {
    const sortedOrders = getSortedOrders();
    return {
      processing: sortedOrders.filter(order => order.status === 'processing'),
      completed: sortedOrders.filter(order => order.status === 'completed'),
      cancelled: sortedOrders.filter(order => order.status === 'cancelled')
    };
  };

  // Helper function to get payment status display
  const getPaymentStatusDisplay = (order) => {
    // Check if payment exists and is completed
    if (order.payment && order.payment.status === "completed") {
      return {
        text: "PAID",
        className: "text-green-600 font-semibold"
      };
    }
    // Check if payment method is cash
    if (order.payment && order.payment.method === "cash") {
      return {
        text: "CASH PAYMENT DUE",
        className: "text-blue-800 font-semibold"
      };
    }
    // If no payment info, show cash payment due as default
    return {
      text: "CASH PAYMENT DUE", 
      className: "text-blue-800 font-semibold"
    };
  };

  // Direct status update function for badge buttons
  const handleDirectStatusUpdate = (id, newStatus) => {
    console.log("Updating order:", { id, newStatus });

    dispatch(
      orderUpdateStatus({
        id: id,
        status: { status: newStatus },
      })
    )
      .unwrap()
      .then((response) => {
        console.log("Status update successful:", response);
      })
      .catch((error) => {
        console.error("Status update failed:", {
          id,
          newStatus,
          error,
          time: new Date().toISOString(),
        });
      });
  };

  // When Archive Order button is clicked
  const handleArchiveClick = (order) => {
    setArchiveOrder(order); // Store the order object
    setShowAlert(true);
  };

  // When user cancels in the alert
  const handleCancel = () => {
    console.log("Cancel Clicked");
    setShowAlert(false);
    setArchiveOrder(null); // Clear the archive order
  };

  // When user confirms Archive in the alert
  const handleConfirm = async () => {
    if (archiveOrder) {
      try {
        // Use the order ID (model transforms _id to id automatically)
        const orderId = archiveOrder.id;
        
        if (!orderId) {
          console.error("No valid order ID found in archiveOrder object");
          return;
        }
        
        // Archive the order
        await dispatch(orderArchiveOne(orderId)).unwrap();

        // Refresh the open orders to remove archived order from list
        await dispatch(orderGetOpen()).unwrap();
        
        setArchiveOrder(null);
      } catch (error) {
        console.error("Error archiving order:", error);
      }
    }
    setShowAlert(false);
  };

  // Format date to MM/DD/YYYY, HH:MM AM/PM
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <>
      <div className="px-4">
        {/* Header with title on left and badges on right */}
        <div className="flex justify-between items-center mt-5 mb-6">
          <h2 className="berkshireSwashFont text-2xl font-bold text-slate-800">
            Open Orders
          </h2>
          
          {/* Badge counts on the right */}
          <div className="flex gap-4">
            {Object.entries(getStatusCounts()).map(([status, count]) => (
              <div
                key={status}
                className={`
                  px-4 py-2 rounded-full font-semibold
                  ${
                    status === "processing"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                      : ""
                  }
                  ${
                    status === "completed"
                      ? "bg-blue-100 text-blue-800 border-blue-800"
                      : ""
                  }
                  ${
                    status === "cancelled"
                      ? "bg-red-100 text-red-800 border-red-800"
                      : ""
                  }
                  border-2
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700" />

        {/* Processing Orders Grid */}
        {(() => {
          const ordersByStatus = getOrdersByStatus();
          return (
            <>
              {ordersByStatus.processing.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Processing Orders ({ordersByStatus.processing.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ordersByStatus.processing.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col"
                      >
                        {/* Header: Order Number and Date */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4">
                          <p className="font-semibold text-gray-800">{order.firstName} {order.lastName}</p>
                          <p className="text-lg font-bold text-green-600">${order.orderTotal}</p>
                        </div>

                        {/* Order Details */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items:</h4>
                          <div className="space-y-1">
                            {order.orderDetails.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.pizzaName}</span>
                                <span className="font-medium">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Update Buttons */}
                        <div className="mb-4 flex-grow">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Update Status:</h4>
                          <div className="flex flex-wrap gap-2">
                            {statusArray.map((status) => (
                              <button
                                key={status}
                                onClick={() => handleDirectStatusUpdate(order._id, status)}
                                disabled={order.status === status}
                                className={`
                                  px-3 py-1 rounded-full text-xs font-semibold border transition-all
                                  ${order.status === status 
                                    ? 'bg-blue-600 text-white border-blue-600 cursor-default' 
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer'
                                  }
                                `}
                              >
                                {order.status === status ? '✓ ' : ''}
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Payment Status and Archive - Fixed at bottom */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                          <div>
                            {(() => {
                              const paymentStatus = getPaymentStatusDisplay(order);
                              return (
                                <span className={`text-sm font-semibold ${paymentStatus.className}`}>
                                  {paymentStatus.text}
                                </span>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() => handleArchiveClick(order)}
                            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-full border border-red-200 hover:border-red-300 transition-colors"
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator HR */}
              {(ordersByStatus.completed.length > 0 || ordersByStatus.cancelled.length > 0) && (
                <hr className="my-8 border-gray-300" />
              )}

              {/* Completed Orders Grid */}
              {ordersByStatus.completed.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Completed Orders ({ordersByStatus.completed.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ordersByStatus.completed.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col opacity-75"
                      >
                        {/* Same card structure as processing orders */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-gray-800">{order.firstName} {order.lastName}</p>
                          <p className="text-lg font-bold text-green-600">${order.orderTotal}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items:</h4>
                          <div className="space-y-1">
                            {order.orderDetails.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.pizzaName}</span>
                                <span className="font-medium">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4 flex-grow">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Status:</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                              ✓ Completed
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                          <div>
                            {(() => {
                              const paymentStatus = getPaymentStatusDisplay(order);
                              return (
                                <span className={`text-sm font-semibold ${paymentStatus.className}`}>
                                  {paymentStatus.text}
                                </span>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() => handleArchiveClick(order)}
                            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-full border border-red-200 hover:border-red-300 transition-colors"
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Orders Grid */}
              {ordersByStatus.cancelled.length > 0 && (
                <div className="mb-20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Cancelled Orders ({ordersByStatus.cancelled.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ordersByStatus.cancelled.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col opacity-60"
                      >
                        {/* Same card structure but with cancelled styling */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-gray-800">{order.firstName} {order.lastName}</p>
                          <p className="text-lg font-bold text-red-600">${order.orderTotal}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items:</h4>
                          <div className="space-y-1">
                            {order.orderDetails.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.pizzaName}</span>
                                <span className="font-medium">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4 flex-grow">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Status:</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                              ✗ Cancelled
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                          <div>
                            {(() => {
                              const paymentStatus = getPaymentStatusDisplay(order);
                              return (
                                <span className={`text-sm font-semibold ${paymentStatus.className}`}>
                                  {paymentStatus.text}
                                </span>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() => handleArchiveClick(order)}
                            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-full border border-red-200 hover:border-red-300 transition-colors"
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
      {showAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <AlertBlack
            alertMsg={alertMsg}
            alertDescription={alertDescription}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
          />
        </div>
      )}
    </>
  );
};

export default AdminOpenOrders;
