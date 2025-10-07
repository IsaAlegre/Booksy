import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useDebounce from "../hooks/UseDebounce";
import { SearchProvider } from "../context/SearchContext";
import { useState, useCallback, useMemo} from "react";

export default function MainLayout() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(isOpen => !isOpen);
  }, []);

  // Memoriza el objeto del contexto para evitar re-renders innecesarios
  const searchContextValue = useMemo(() => ({
    query,
    debouncedQuery,
    setQuery
  }), [query, debouncedQuery]);

  return (
    <SearchProvider value={ searchContextValue}>
      <div className="relative min-h-screen bg-[#e2ded0]">
        {/* Sidebar que se desliza */}
        <aside
          className={`
            peer group fixed top-0 left-0 h-full z-40 
            transition-transform duration-300 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
          `}
        >
          <Sidebar toggleSidebar={toggleSidebar} />
        </aside>

        {/* Overlay para cerrar el sidebar en móviles */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            aria-hidden="true"
          />
        )}

        {/* Contenido principal con margen para el sidebar en desktop */}
        <div className="flex flex-col min-w-0 md:ml-24 peer-hover:md:ml-48  transition-all duration-300">
          <header>
            <Navbar query={query} onSearch={setQuery} toggleSidebar={toggleSidebar} />
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}