import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router";
import OperatingBanner from "../components/OperatingBanner";

const CustomerLayout = () => {
  const location = useLocation();
  const hideBanner = location.pathname === "/order-success";
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {!hideBanner && <OperatingBanner />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
