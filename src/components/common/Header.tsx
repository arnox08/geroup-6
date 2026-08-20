import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { LogOut, UserCheck, ShieldCheck, RefreshCw, ChevronDown, Monitor, Clock, Settings, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & College Title + Portal Indicator */}
          <div className="flex items-center gap-3">
            <Logo size="md" showText={true} />
            <div className="hidden md:block h-8 w-px bg-slate-200" />
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                ระบบจองห้องและคอมพิวเตอร์
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 border shadow-2xs ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-purple-100 text-purple-900 border-purple-300'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>[ ADMIN PORTAL - ระบบผู้ดูแลระบบ ]</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>[ USER PORTAL - ระบบบริการนักศึกษา ]</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right Action Bar - Shows ONLY current user's profile securely */}
          <div className="flex items-center gap-3">
            
            {/* Current Active User Profile Card (Strictly Only Active User Info) */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-500 shadow-2xs"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span className="font-mono font-bold text-purple-700">{currentUser.code}</span>
                  <span>•</span>
                  <span>{currentUser.department}</span>
                </div>
              </div>

              {/* Role Badge */}
              <span
                className={`flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border shadow-2xs ${
                  currentUser.role === 'admin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-700'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ผู้ดูแลระบบ</span>
                    <span className="sm:hidden">Admin</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">นักศึกษา</span>
                    <span className="sm:hidden">User</span>
                  </>
                )}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200 flex items-center gap-1"
              title="ออกจากระบบ (Logout)"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-semibold hidden md:inline">ออกจากระบบ</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
