import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-main flex">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Content Area */}
      <div 
        className={`flex-grow flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-[70px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Header */}
        <AdminHeader setIsMobileOpen={setIsMobileOpen} />

        {/* Content */}
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};
