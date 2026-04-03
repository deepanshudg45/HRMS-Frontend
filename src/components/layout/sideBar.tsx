import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { role } = useContext(AuthContext);
  const location = useLocation();

  const links = [
    { name: "Attendance", path: "/app/attendance" },
    { name: "Leave", path: "/app/leave" },
    { name: "Onboarding", path: "/app/onboarding" },
    { name: "Expenses", path: "/app/expenses" },
    { name: "Assets", path: "/app/assets" },
  ];

  const adminLinks = [
    { name: "Admin Panel", path: "/app/admin" },
  ];

  return (
    <div className="w-[240px] bg-gray-800 text-white p-4">
      <h2 className="mb-4">Logo</h2>

      {/* Main links */}
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`block p-2 ${
            location.pathname === link.path ? "bg-gray-600" : ""
          }`}
        >
          {link.name}
        </Link>
      ))}

      {/* Role-based links */}
      {role === "HR" &&
        adminLinks.map((link) => (
          <Link key={link.path} to={link.path} className="block p-2">
            {link.name}
          </Link>
        ))}
    </div>
  );
};

export default Sidebar;