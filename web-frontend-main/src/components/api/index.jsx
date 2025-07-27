import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
}

export default Admin;