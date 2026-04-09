import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  const links = [
    { name: "Assets", path: "/app/assets" },
    { name: "My Assets", path: "/app/my-assets" },
  ];

  const adminLinks = [
    { name: "Asset Reports", path: "/app/assets/reports" },
    { name: "Admin Panel", path: "/app/admin" },
  ];

  return (
    <div className="w-[260px] border-r border-blue-100 bg-white p-5 text-slate-700">
      <div className="mb-8 px-2">
        <h2 className="text-2xl font-semibold text-slate-800">HRMS</h2>
      </div>

      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`mb-1 block rounded-xl px-4 py-3 text-left text-base font-semibold transition ${
            location.pathname === link.path
              ? "bg-blue-50 text-blue-700"
              : "text-slate-800 hover:bg-blue-50 hover:text-blue-700"
          }`}
        >
          {link.name}
        </Link>
      ))}

      {auth?.role === "HR" &&
        adminLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mb-1 block rounded-xl px-4 py-3 text-left text-base font-semibold transition ${
              location.pathname === link.path
                ? "bg-blue-50 text-blue-700"
                : "text-slate-800 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
    </div>
  );
};

export default Sidebar;
