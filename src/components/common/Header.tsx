import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { LogOut, UserCheck, ShieldCheck, RefreshCw, ChevronDown, Monitor, Clock, Settings, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, switchUserDemo, users, resetToDefaultData } = useApp();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

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

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Quick Role / Demo Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                title="สลับบัญชีทดสอบระบบ"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">สลับสิทธิ์ทดสอบ</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    เลือกสิทธิ์ทดสอบระบบ (Demo Roles)
                  </div>

                  <div className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUserDemo(u.id);
                          setShowDemoMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50/70 transition-colors ${
                          currentUser.id === u.id ? 'bg-purple-100/60 font-semibold text-purple-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-6 h-6 rounded-full object-cover border border-purple-200"
                          />
                          <div>
                            <div className="truncate font-medium">{u.name}</div>
                            <div className="text-[10px] text-slate-400">รหัส: {u.code}</div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {u.role === 'admin' ? 'แอดมิน' : 'นักศึกษา'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        resetToDefaultData();
                        setShowDemoMenu(false);
                      }}
                      className="w-full text-center px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-purple-700 hover:bg-slate-50 rounded"
                    >
                      รีเซ็ตข้อมูลตั้งต้นทั้งหมด
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current User Profile Card */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-500 shadow-2xs"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span>{currentUser.code}</span>
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
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
              title="ออกจากระบบ (Logout)"
            >
              <LogOut className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
