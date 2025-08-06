// TODO: capstone+ : add function that deletes or archives orders older then 30 days

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderGetArchived } from "../redux/orderSlice";

const AdminCompletedOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // Grab order
  useEffect(() => {
    dispatch(orderGetArchived());
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

  return (
    <>
      <div className="ml-64 px-4">
        <h2 className="berkshireSwashFont mt-5 text-center text-2xl font-bold text-slate-800">
          Completed (Archived) Orders Database
        </h2>
        <hr className="my-6 sm:mx-auto lg:my-8 border-gray-700 " />

        <div className="flex justify-center gap-4 mb-6">
          {Object.entries(getStatusCounts()).map(([status, count]) => (
            <div
              key={status}
              className="px-4 py-2 rounded-full font-semibold bg-gray-100 text-gray-800 border-gray-800 border-2"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
            </div>
          ))}
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
                  {/* **Address (Shipping/Delivery Address)** */}
                  Destination
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
                    {order.address.street}
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
    </>
  );
};

export default AdminCompletedOrders;
