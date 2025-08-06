import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AlertBlack from "../components/AlertBlack";
import SpinnerBubbles from "../components/SpinnerBubbles";
import {
  orderGetOpen,
  orderUpdateStatus,
  orderArchiveOne,
} from "../redux/orderSlice";

const AdminOpenOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  // const [newStatus, setNewStatus] = useState({});
  const [localStatus, setLocalStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [archiveOrder, setArchiveOrder] = useState(null);

  const alertMsg = archiveOrder
    ? `Are you sure you want to archive order #${archiveOrder.orderNumber}?`
    : "Are you sure you want to archive this order?";
  const alertDescription = "Click to confirm";

  const statusArray = ["processing", "completed", "delivered", "cancelled"];

  // Grab open order
  useEffect(() => {
    dispatch(orderGetOpen());
    console.log("useEffect", orders);
  }, []);

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
        delivered: 0,
        cancelled: 0,
      }
    );
  };
  const getSortedOrders = () => {
    const statusOrder = {
      processing: 1,
      completed: 2,
      delivered: 3,
      cancelled: 4,
    };

    return [...orders].sort((a, b) => {
      // First sort by status order
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then sort by date within same status
      return new Date(b.date) - new Date(a.date);
    });
  };

  const handleStatusUpdate = (id) => {
    setSavingId(id);
    setLoading(true);

    const statusToUpdate =
      localStatus[id] ?? orders.find((o) => o.id === id)?.status;
    // Add delay before dispatch
    setTimeout(() => {
      dispatch(
        orderUpdateStatus({
          id: id,
          status: { status: statusToUpdate },
        })
      )
        .then(() => {
          return new Promise((resolve) => setTimeout(resolve, 2000));
        })
        .then(() => {
          setSavingId(null);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Status update failed:", {
            id,
            error,
            time: new Date().toISOString(),
          });
          setSavingId(null);
          setLoading(false);
        });
    }, 1000);

    console.log("Initial states:", {
      savingId: id,
      loading: true,
      time: new Date().toISOString(),
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
        // First update the status to "archived"
        await dispatch(
          orderUpdateStatus({
            id: archiveOrder._id,
            status: { status: "archived" },
          })
        ).unwrap();

        // Then archive the order
        await dispatch(orderArchiveOne(archiveOrder._id)).unwrap();

        // Finally refresh the open orders
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
                  status === "delivered"
                    ? "bg-green-100 text-green-800 border-green-800"
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
                  Destination
                </th>
                <th scope="col" className="px-6 py-3 w-[10%] text-center">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3 w-[8%] text-center">
                  Total $
                </th>
                <th scope="col" className="px-6 py-3 w-[10%] text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 w-[10%] text-center">
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
                    {order.address.street}
                    <br />
                    {order.address.zip}
                  </td>
                  <td className="px-2 py-2 w-[10%] text-center">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-2 py-2 w-[8%] text-center">
                    ${order.orderTotal}
                  </td>

                  <td className="px-2 py-2 w-auto min-w-full text-center">
                    <select
                      value={localStatus[order._id] ?? order.status}
                      onChange={(e) => {
                        setLocalStatus((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }));
                      }}
                      className="text-sm rounded-lg block w-full p-2.5 text-center
                          dark:text-cyan-700 
                          bg-slate-100
                          border-slate-500
                          focus:ring-white
                          focus:border-sky-500"
                      style={{ textAlignLast: "center" }}
                    >
                      {statusArray.map((status) => (
                        <option
                          className="text-center"
                          style={{ textAlign: "left" }}
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-4 w-[10%] text-center">
                    <div className="relative w-32 h-12">
                      {" "}
                      {/* Fixed width/height container */}
                      {savingId === order._id && loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <SpinnerBubbles loading={loading} />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(order._id)}
                          className="w-full h-full px-4 py-2 cursor-pointer hover:underline disabled:cursor-not-allowed text-blue-600 disabled:hover:text-slate-600 font-semibold"
                        >
                          Save Status
                        </button>
                      )}
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
