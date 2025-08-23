import { Routes, Route } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect, Suspense, lazy } from "react";
import { setAuthFromStorage } from "./redux/authSlice";
import PrivateRoute from "./PrivateRoute";
import { logBundlePerformance } from "./utils/performance.jsx";
import "./App.css";

// Immediately needed components (above the fold)
import CustomerLayout from "./customer/CustomerLayout";
import AdminLayout from "./admin/AdminLayout";
import PerformanceMonitor from "./components/PerformanceMonitor";
import TestingALert from "./TestingALert";

// Lazy load components for better code splitting
const About = lazy(() => import("./customer/About"));
const OrderMenu = lazy(() => import("./customer/OrderMenu"));
const Contact = lazy(() => import("./customer/Contact"));
const Checkout = lazy(() => import("./customer/Checkout"));
const OrderSuccess = lazy(() => import("./customer/OrderSuccess"));
const PrivacyPolicy = lazy(() => import("./legal/PrivacyPolicy"));
const TermsCond = lazy(() => import("./legal/TermsCond"));

// Admin components (only loaded when accessing admin)
const AdminOpenOrders = lazy(() => import("./admin/AdminOpenOrders"));
const AdminArchivedOrders = lazy(() => import("./admin/AdminArchivedOrders"));
const AdminMenu = lazy(() => import("./admin/AdminMenu"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminUpdateOne = lazy(() => import("./admin/AdminUpdateOne"));
const AdminInbox = lazy(() => import("./admin/AdminInbox"));
const IngredientsTable = lazy(() => import("./admin/IngredientsTable"));
const AdminBuilderCreate = lazy(() => import("./admin/AdminBuilderCreate"));

// Error boundary and fallback components
const NoMatch = lazy(() => import("./components/NoMatch"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

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

    // Log performance metrics in development
    if (import.meta.env.MODE === "development") {
      logBundlePerformance();
    }
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/testing" element={<TestingALert />} />

        {/* Public/customer routes */}
        <Route element={<CustomerLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/order-menu"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <OrderMenu />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/checkout"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Checkout />
              </Suspense>
            }
          />
          <Route
            path="/order-success"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <OrderSuccess />
              </Suspense>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <TermsCond />
              </Suspense>
            }
          />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/pizza-builder"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminBuilderCreate />
                </Suspense>
              }
            />
            <Route
              path="/open-orders"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminOpenOrders />
                </Suspense>
              }
            />
            <Route
              path="/archived-orders"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminArchivedOrders />
                </Suspense>
              }
            />
            <Route
              path="/admin-menu/:id?"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminMenu />
                </Suspense>
              }
            />
            <Route
              path="/admin-update-one/:id"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminUpdateOne />
                </Suspense>
              }
            />
            <Route
              path="/ingredient-table"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <IngredientsTable />
                </Suspense>
              }
            />
            <Route
              path="/admin-inbox"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminInbox />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route
          path="/admin-login"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NoMatch />
            </Suspense>
          }
        />
      </Routes>

      {/* Performance monitoring in development */}
      {/* <PerformanceMonitor /> */}
    </Suspense>
  );
}

export default App;
