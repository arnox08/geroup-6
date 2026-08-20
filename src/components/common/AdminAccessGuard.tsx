import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, RefreshCw, UserCheck, LogOut } from 'lucide-react';

interface AdminAccessGuardProps {
  children: React.ReactNode;
}

export const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({ children }) => {
  const { currentUser, switchUserDemo, users, logout } = useApp();

  if (!currentUser) return null;

  if (currentUser.role !== 'admin') {
    const adminUser = users.find((u) => u.role === 'admin');

    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white rounded-3xl border-2 border-red-200 shadow-xl overflow-hidden p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-3xl border border-red-300 flex items-center justify-center mx-auto text-red-600 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
              HTTP 403 Forbidden - Access Denied
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              ปฏิเสธการเข้าถึง: ระบบผู้ดูแลระบบ (Admin Access Denied)
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              บัญชีปัจจุบันของคุณ <strong className="text-slate-900">"{currentUser.name}" ({currentUser.code})</strong> มีระดับสิทธิ์เป็น <span className="text-purple-700 font-bold">นักศึกษา/ผู้ใช้ทั่วไป</span> ซึ่งได้รับอนุญาตเฉพาะระบบบริการจองคอมพิวเตอร์เท่านั้น
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-red-500" />
              <span>กฎการเข้าถึงความปลอดภัย (Access Policy Rules):</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
              <li>ระบบอนุมัติการจองและตารางเรียน สงวนไว้สำหรับผู้ดูแลระบบเท่านั้น</li>
              <li>หากต้องการใช้งานส่วนนี้ กรุณาเข้าสู่ระบบด้วยบัญชีสิทธิ์ Admin</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {adminUser && (
              <button
                onClick={() => switchUserDemo(adminUser.id)}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>สลับเป็นบัญชี Admin ({adminUser.name})</span>
              </button>
            )}

            <button
              onClick={() => logout()}
              className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบกลับหน้าล็อกอิน</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
