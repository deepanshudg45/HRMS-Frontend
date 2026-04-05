import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Topbar = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="flex h-[64px] items-center justify-between bg-white px-4 shadow">
      <h3>Dashboard</h3>

      <div className="flex items-center gap-4">
        <button type="button">Notifications</button>

        <div>
          <button type="button">Profile</button>
          <button type="button" onClick={() => auth?.logout()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
