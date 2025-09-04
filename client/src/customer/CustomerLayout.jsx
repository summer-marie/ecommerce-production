import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import OperatingBanner from "../components/OperatingBanner";

const CustomerLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
  <OperatingBanner />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default CustomerLayout;
