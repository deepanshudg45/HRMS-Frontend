import Sidebar from "./sideBar";
import Topbar from "./topBar";

const AppShell = ({ children }: any) => {
  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <Topbar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppShell;