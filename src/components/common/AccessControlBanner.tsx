import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Lock, Unlock, AlertTriangle, ArrowRight, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AccessControlBanner: React.FC = () => {
  const { currentUser, logout, switchUserDemo, users } = useApp();
  const [expanded, setExpanded] = useState(false);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  return (
    <div
      className={`border-b transition-colors ${
        isAdmin
          ? 'bg-slate-900 border-amber-500/30 text-white'
          : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-purple-500/30 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Left: Role & Access Level Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 uppercase tracking-wider shrink-0 shadow-xs ${
                isAdmin
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-emerald-400 text-slate-950 font-black'
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>ระดับสิทธิ์: ผู้ดูแลระบบ (ADMIN LEVEL)</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-slate-950" />
                  <span>ระดับสิทธิ์: นักศึกษา / ผู้ใช้ทั่วไป (USER LEVEL)</span>
                </>
              )}
            </span>

            <div className="hidden sm:block text-slate-200 text-[11px] font-medium">
              {isAdmin ? (
                <span>เข้าถึงศูนย์ควบคุมอนุมัติ จัดการตารางเรียน จัดการห้อง และ Google Sheets</span>
              ) : (
                <span>เข้าถึงระบบค้นหาผังห้อง จองเครื่องคอมพิวเตอร์ และนำเข้าข้อมูลช่องที่ 2</span>
              )}
            </div>
          </div>

          {/* Right: Actions & Access Details Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] underline text-slate-300 hover:text-white font-bold flex items-center gap-1"
            >
              <span>{expanded ? 'ซ่อนขอบเขตสิทธิ์' : 'ตรวจสอบขอบเขตสิทธิ์เข้าถึง'}</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

            {/* Switch Account Quick Action */}
            <button
              onClick={() => {
                const targetRole = isAdmin ? 'student' : 'admin';
                const targetUser = users.find((u) => u.role === targetRole);
                if (targetUser) {
                  switchUserDemo(targetUser.id);
                }
              }}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs ${
                isAdmin
                  ? 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-purple-200 border border-purple-400/30'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'สลับเป็นสิทธิ์นักศึกษา' : 'สลับเป็นสิทธิ์ผู้ดูแลระบบ (Admin)'}</span>
            </button>
          </div>
        </div>

        {/* Expanded Access Policy Notice */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] animate-fadeIn">
            {/* Allowed Capabilities */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>สิ่งที่ได้รับอนุญาตตามสิทธิ์ ({currentUser.role.toUpperCase()}):</span>
              </div>
              <ul className="list-disc list-inside text-slate-200 space-y-1 pl-1">
                {isAdmin ? (
                  <>
                    <li>อนุมัติ หรือปฏิเสธรายการขอจองห้องและคอมพิวเตอร์</li>
                    <li>ล็อกตารางเรียนประจำสาขาสำหรับรายวิชาต่างๆ</li>
                    <li>เพิ่ม แก้ไข หรือปิดปรับปรุงห้องปฏิบัติการและเครื่อง PC</li>
                    <li>บริหารจัดการสมาชิก และเชื่อมตั้งค่า Google Sheets API</li>
                    <li>ส่งข้อมูลรายละเอียดช่องที่ 2 ผ่าน Google Apps Script</li>
                  </>
                ) : (
                  <>
                    <li>ตรวจสอบผังห้อง และสถานะว่าง/ใช้งาน ของเครื่อง PC แบบ Real-time</li>
                    <li>ยื่นเรื่องขอจองเครื่องคอมพิวเตอร์ตามรอบเวลาที่ต้องการ</li>
                    <li>ดูและพิมพ์ใบบันทึกการจอง (Booking Slip)</li>
                    <li>แจ้งอุบัติเหตุ/คอมพิวเตอร์ชำรุด (Defect Report)</li>
                    <li>นำเข้าข้อมูลรายละเอียดช่องที่ 2 ผ่าน Google Apps Script</li>
                  </>
                )}
              </ul>
            </div>

            {/* Access Restrictions / Security Guard */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ข้อจำกัดและขอบเขตการรักษาความปลอดภัย:</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                {isAdmin ? (
                  <>
                    <li>การแก้ไขข้อมูลตารางเรียนและการปิดห้องจะมีผลกระทบกับระบบทันที</li>
                    <li>ควรตรวจสอบสิทธิ์บัญชีก่อนทำการอนุมัติรายการจอง</li>
                  </>
                ) : (
                  <>
                    <li><strong className="text-amber-300">ไม่สามารถ</strong> เข้าถึงเมนูอนุมัติหรือเปลี่ยนสถานะการจองได้</li>
                    <li><strong className="text-amber-300">ไม่สามารถ</strong> เพิ่ม ลบ หรือปิดปรับปรุงห้องคอมพิวเตอร์ได้</li>
                    <li><strong className="text-amber-300">ไม่สามารถ</strong> แก้ไขตารางเรียนหรือการตั้งค่า Google Sheets ได้</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
