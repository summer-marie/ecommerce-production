/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { ClipLoader } from "react-spinners";
import { getMessages } from "../redux/messageSlice";

const AdminSidenav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const messages = useSelector((state) => state.message);

  console.log("location", location);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Timeout for visual feedback
      await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            await dispatch(logout()).unwrap();
            resolve();
          } catch (error) {
            console.error("Logout failed:", error);
            setLoading(false);
          }
        }, 1000);
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
        style={{ minHeight: "100vh" }}
      >
        <div className="flex flex-col items-center">
          <ClipLoader color="#38bdf8" size={60} />
          <div className="mt-4 text-white text-lg">Logging out...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div
          className="h-full px-3 py-4 overflow-y-auto 
        bg-emerald-950"
        >
          <ul className="space-y-2 font-medium">
            <h2 className="mt-5 text-md font-bold text-stone-200 py-2">
              Orders
            </h2>
            <hr className="border-gray-500 " />
            <li>
              <Link
                to="/open-orders"
                className={`flex items-center p-2 rounded-lg group 
                 ${
                   location.pathname === "/open-orders"
                     ? "bg-lime-300/70"
                     : "hover:bg-gray-700 text-stone-200"
                 }
                `}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/open-orders"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }
                      `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                  />
                </svg>

                <span className="ms-3">Open Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/completed-orders"
                className={`flex items-center p-2 rounded-lg group 
                  ${
                    location.pathname === "/completed-orders"
                      ? "bg-lime-300/70"
                      : "hover:bg-gray-700 text-stone-200"
                  }
                 `}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/completed-orders"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }
                 `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span className="ms-3">Completed Orders</span>
              </Link>
            </li>
            <h2 className="mt-5 text-md font-bold text-stone-200 py-2">Menu</h2>
            <hr className="border-gray-500 " />
            <li>
              <Link
                to="/pizza-builder"
                className={`flex items-center p-2 rounded-lg group 
                  ${
                    location.pathname === "/pizza-builder"
                      ? "bg-lime-300/70"
                      : "hover:bg-gray-700 text-stone-200"
                  }
                 `}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/pizza-builder"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }
             `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Add New Pizza
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin-menu"
                className={`flex items-center p-2 rounded-lg group 
                  ${
                    location.pathname === "/admin-menu"
                      ? "bg-lime-300/70"
                      : "hover:bg-gray-700 text-stone-200"
                  }
                 `}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/admin-menu"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }
             `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <g clipPath="url(#a)">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m10.4149 10.7623.0005.0109m3.0868 3.0764.0005.0108M8.91554 15.349l.00046.0108m-.8276-8.44549L4.39857 19.9133l12.95163-3.7371m-.8271-8.43475c2.0971 2.09707 3.269 4.77055 3.5172 7.51635.067.7413-.4619 1.3752-1.1869 1.5293-1.0146.2158-1.9613-.5811-2.0926-1.615-.2412-1.9-.9437-3.5721-2.52-5.1484-1.5779-1.57793-3.3173-2.3457-5.25302-2.61955-1.02139-.1445-1.79555-1.1099-1.5387-2.10314.17236-.66653.76818-1.14208 1.45754-1.08543 2.78088.22851 5.49388 1.40332 7.61648 3.52587Z"
                    />
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="#fff" d="M0 0h24v24H0z" />
                    </clipPath>
                  </defs>
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Current Menu
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/ingredient-table"
                className={`flex items-center p-2 rounded-lg group 
                  ${
                    location.pathname === "/ingredient-table"
                      ? "bg-lime-300/70"
                      : "hover:bg-gray-700 text-stone-200"
                  }`}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/ingredient-table"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">
                  Ingredients Table
                </span>
              </Link>
            </li>

            <h2 className="mt-5 text-md font-bold text-stone-200 py-2">
              Customer Feedback
            </h2>
            <hr className="border-gray-500 " />
            <li>
              <Link
                to="/admin-inbox"
                className={`flex items-center p-2 rounded-lg group 
                  ${
                    location.pathname === "/admin-inbox"
                      ? "bg-lime-300/70"
                      : "hover:bg-gray-700 text-stone-200"
                  }
                 `}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/admin-inbox"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }
                  `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 6h-2V5h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2h-.541A5.965 5.965 0 0 1 14 10v4a1 1 0 1 1-2 0v-4c0-2.206-1.794-4-4-4-.075 0-.148.012-.22.028C7.686 6.022 7.596 6 7.5 6A4.505 4.505 0 0 0 3 10.5V16a1 1 0 0 0 1 1h7v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3h5a1 1 0 0 0 1-1v-6c0-2.206-1.794-4-4-4Zm-9 8.5H7a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>

                <span className="inline-flex items-center justify-center w-4 h-4 p-3.5 ms-3 text-sm font-bold rounded-full text-white bg-blue-800 border-2 border-green-300 shadow-md animate-pulse">
                  {messages?.messages?.length || 0}
                </span>
              </Link>
            </li>
            <h2 className="mt-5 text-md font-bold text-stone-200 py-2">
              Your Account
            </h2>
            <hr className="border-gray-500 " />
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center p-2 rounded-lg group hover:bg-red-800 text-stone-200 w-full cursor-pointer"
              >
                <svg
                  className="w-6 h-6 transition duration-75 group-hover:text-white text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1Zm13-6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="flex ms-3 whitespace-nowrap">Sign Out</span>
              </button>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-2 rounded-lg group 
                        ${
                          location.pathname === "/settings"
                            ? "bg-lime-300/70"
                            : "hover:bg-gray-700 text-stone-200"
                        }
                       `}
              >
                <svg
                  className={`w-6 h-6 transition duration-75 group-hover:text-white ${
                    location.pathname === "/settings"
                      ? "text-gray-700"
                      : "text-gray-400 "
                  }
                   `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AdminSidenav;
