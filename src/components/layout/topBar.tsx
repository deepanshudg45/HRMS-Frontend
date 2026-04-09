import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Topbar = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="flex h-[72px] items-center justify-between border-b border-blue-100 bg-white px-6">
      <div />

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
        >
          Notifications
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm text-slate-600"
          >
            Profile
          </button>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            onClick={() => auth?.logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
