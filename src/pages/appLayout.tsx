import { Outlet } from "react-router-dom";
import AppShell from "../components/layout/appShell";

const AppLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default AppLayout;
