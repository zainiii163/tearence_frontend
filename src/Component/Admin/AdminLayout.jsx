import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userDetail } = useSelector((store) => store.auth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[hsl(210_40%_98%)]">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/80 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Admin Info */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Administrator</p>
                <p className="text-xs text-slate-500">{userDetail?.email || 'admin@wwa.com'}</p>
              </div>
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
