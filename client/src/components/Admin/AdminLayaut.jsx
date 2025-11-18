import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed en móvil, relativo en desktop */}
      <div className={`
        fixed lg:relative top-0 h-screen z-50 
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'lg:w-64' : 'lg:w-0'}
      `}>
        <div className={`h-full ${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Header */}
        <header className="bg-[#e2ded0] shadow-sm border-b border-[#647c90] sticky top-0 z-30">
          <div className="px-4 lg:px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#647c90] hover:text-[#175873] transition-colors"
              aria-label="Toggle sidebar"
            >
              <GiHamburgerMenu size={28} />
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-[#175873]">Panel de Administración</h1>
            <div className="w-7 lg:w-10"></div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}