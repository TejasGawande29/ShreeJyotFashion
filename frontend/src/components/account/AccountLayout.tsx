'use client';

import { ReactNode, useState } from 'react';
import AccountSidebar from './AccountSidebar';
import { FiMenu, FiX } from 'react-icons/fi';

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sidebarOpen ? (
                <>
                  <FiX className="w-5 h-5" />
                  <span>Close Menu</span>
                </>
              ) : (
                <>
                  <FiMenu className="w-5 h-5" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>

          {/* Sidebar - Desktop: Always visible, Mobile: Toggleable */}
          <div className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block lg:flex-shrink-0`}>
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
