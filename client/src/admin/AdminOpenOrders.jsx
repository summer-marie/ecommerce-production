import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AlertBlack from "../components/AlertBlack";
import {
  orderGetOpen,
  orderUpdateStatus,
  orderArchiveOne,
} from "../redux/orderSlice";

// TODO: explore other gui interface and user controls to make tracking orders easier

// TODO: Refresh issue when new orders are being created. have to reload to see them 


const AdminOpenOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [archiveOrder, setArchiveOrder] = useState(null);

  const alertMsg = archiveOrder
    ? `Are you sure you want to archive order #${archiveOrder.orderNumber}?`
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
    const statusOrder = {
      processing: 1,
      completed: 2,
      cancelled: 3,
    };

    return [...orders].sort((a, b) => {
      // First sort by status order
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then sort by date within same status
      return new Date(b.date) - new Date(a.date);
    });
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
        console.log("Archiving order:", archiveOrder._id);
        
        // Just archive the order directly
        await dispatch(orderArchiveOne(archiveOrder._id)).unwrap();

        // Refresh the open orders to remove archived order from list
        await dispatch(orderGetOpen()).unwrap();
        
        console.log("Order archived successfully");
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
      // year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="ml-64 px-4">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Open Orders
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700" />

        {/* Badge counts */}
        <div className="flex justify-center gap-4 mb-6">
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

        <div id="openOrdersTAble" className="overflow-x-auto shadow-2xl mb-20">
          <table
            className="w-full text-sm text-left rtl:text-right rounded-2xl
        text-gray-500"
          >
            <thead
              className="text-xs uppercase 
          bg-gray-400
          text-teal-950"
            >
              <tr>
                <th scope="col" className="px-6 py-3 w-[8%] text-center">
                  Order Number
                </th>
                <th scope="col" className="px-6 py-3 w-[12%] text-center">
                  Date/Time Order
                </th>
                <th scope="col" className="px-6 py-3 w-[20%] text-center">
                  Order Details/Quantity
                </th>
                <th scope="col" className="px-6 py-3 w-[15%] text-center">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3 w-[10%] text-center">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3 w-[8%] text-center">
                  Total $
                </th>
                <th scope="col" className="px-6 py-3 w-[15%] text-center">
                  Update Status
                </th>
                <th scope="col" className="px-6 py-3 w-[7%] text-center">
                  Archive Order
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedOrders().map((order) => (
                <tr
                  key={order._id}
                  order={order}
                  className=" border-b px-4 py-4
              odd:bg-stone-200
              even:bg-gray-300 
              border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900  w-[8%] text-center"
                  >
                    <p className="">{order.orderNumber}</p>
                  </th>
                  <td className="px-2 py-2 w-[12%] text-center">
                    <p className=""> {formatDate(order.date)}</p>
                  </td>
                  <td className="px-2 py-2 w-[20%] text-center">
                    {/* Map over order details to show items in order */}

                    {order.orderDetails.map((item, index) => (
                      <div key={index}>
                        {item.pizzaName} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-2 py-2 w-[15%] text-center">
                    {(() => {
                      const paymentStatus = getPaymentStatusDisplay(order);
                      return (
                        <span className={paymentStatus.className}>
                          {paymentStatus.text}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-2 py-2 w-[10%] text-center">
                    {order.firstName}
                  </td>
                  <td className="px-2 py-2 w-[8%] text-center">
                    ${order.orderTotal}
                  </td>

                  <td className="px-2 py-2 w-[15%] text-center">
                    <div className="flex flex-col gap-1">
                      {statusArray.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleDirectStatusUpdate(order._id, status)}
                          disabled={order.status === status}
                          className={`
                            px-3 py-2 rounded-full text-xs font-semibold border transition-all
                            ${order.status === status 
                              ? 'bg-blue-600 text-white border-blue-600 cursor-default' 
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer'
                            }
                            ${order.status === status ? 'opacity-100' : 'opacity-100'}
                          `}
                        >
                          {order.status === status ? '✓ ' : ''}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 w-[7%] text-center">
                    <div className="relative">
                      <div className="w-full top-0 right-2 "></div>
                      <button
                        onClick={() => handleArchiveClick(order)}
                        type="submit"
                        className="font-medium text-red-700 w-full h-full border-3 rounded-xl hover:bg-red-700 hover:text-white hover:border-black cursor-pointer"
                      >
                        Archive Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-opacity-30">
          <div className="rounded-xl shadow-2xl max-w-md w-full">
            <AlertBlack
              alertMsg={alertMsg}
              alertDescription={alertDescription}
              handleCancel={handleCancel}
              handleConfirm={handleConfirm}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOpenOrders;
