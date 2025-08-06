import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const CustomerLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default CustomerLayout;
