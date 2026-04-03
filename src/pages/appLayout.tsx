import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const AppLayout = () => {
  const { employee, logout } = useContext(AuthContext);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#eee", padding: "10px" }}>
        <h3>Menu</h3>
        <p>Dashboard</p>
        <p>Users</p>
        <p>Settings</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Welcome {employee?.name || "User"}</h2>
          <button onClick={logout}>Logout</button>
        </div>

        <hr />

        {/* Page Content */}
        <div>
          <h3>Dashboard Content</h3>
          <p>This is your main app area</p>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;