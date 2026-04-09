import Sidebar from "./sideBar";
import Topbar from "./topBar";

const AppShell = ({ children }: any) => {
  return (
    <div className="flex h-screen bg-[#f7fbff]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-[#f7fbff] p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
