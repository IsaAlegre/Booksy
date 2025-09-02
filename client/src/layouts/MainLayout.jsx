import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#f3ede7]">
      <aside>
        <Sidebar />
      </aside>
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <header>
          <Navbar />
        </header>
        <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
