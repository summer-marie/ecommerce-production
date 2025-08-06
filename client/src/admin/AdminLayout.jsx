import AdminSidenav from "./AdminSidenav";
import { Outlet } from "react-router";

const AdminLayout = () => (
  <>
    <AdminSidenav />
    <div className="admin-content">
      <Outlet />
    </div>
  </>
);

export default AdminLayout;