import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Topbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="h-[64px] bg-white shadow flex items-center justify-between px-4">
      
      <h3>Dashboard</h3>

      <div className="flex items-center gap-4">
        
        {/* Notification placeholder */}
        <button>🔔</button>

        {/* User menu */}
        <div>
          <button>👤</button>
          <button onClick={logout}>Logout</button>
        </div>

      </div>
    </div>
  );
};

export default Topbar;