import { Routes, Route } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAuthFromStorage } from "./redux/authSlice";
import PrivateRoute from "./PrivateRoute";
import NoMatch from "./components/NoMatch";
import About from "./customer/About";
import OrderMenu from "./customer/OrderMenu";
import Contact from "./customer/Contact";
import Checkout from "./customer/Checkout";
import AdminOpenOrders from "./admin/AdminOpenOrders";
import AdminCompletedOrders from "./admin/AdminCompletedOrders";
import AdminMenu from "./admin/AdminMenu";
import AdminLogin from "./admin/AdminLogin";
import BuildYourOwn from "./customer/BuildYourOwn";
import AdminUpdateOne from "./admin/AdminUpdateOne";
import AdminInbox from "./admin/AdminInbox";
import IngredientsTable from "./admin/IngredientsTable";
import AdminBuilderCreate from "./admin/AdminBuilderCreate";
import OrderSuccess from "./customer/OrderSuccess";
import AdminLayout from "./admin/AdminLayout";
import CustomerLayout from "./customer/CustomerLayout";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("userOn");
    const user =
      userString && userString !== "undefined" ? JSON.parse(userString) : null;

    // Always call setAuthFromStorage to set loading to false
    dispatch(
      setAuthFromStorage({
        token: token || null,
        user: user || null,
      })
    );
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Public/customer routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<About />} />
          <Route path="/order-menu" element={<OrderMenu />} />
          <Route path="/order-create" element={<BuildYourOwn />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/pizza-builder" element={<AdminBuilderCreate />} />
            <Route path="/open-orders" element={<AdminOpenOrders />} />
            <Route
              path="/completed-orders"
              element={<AdminCompletedOrders />}
            />
            <Route path="/admin-menu/:id?" element={<AdminMenu />} />
            <Route path="/admin-update-one/:id" element={<AdminUpdateOne />} />
            <Route path="/ingredient-table" element={<IngredientsTable />} />
            <Route path="/admin-inbox" element={<AdminInbox />} />
          </Route>
        </Route>

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
