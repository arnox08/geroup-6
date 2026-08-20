import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AccessControlBanner: React.FC = () => {
  const { currentUser } = useApp();
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
                  <span>ระดับสิทธิ์: บัญชีผู้ใช้งาน ({currentUser.name})</span>
                </>
              )}
            </span>

            <div className="hidden sm:block text-slate-200 text-[11px] font-medium">
              {isAdmin ? (
                <span>เข้าถึงศูนย์ควบคุมอนุมัติ จัดการตารางเรียน จัดการห้อง และ Google Sheets</span>
              ) : (
                <span>เข้าถึงระบบค้นหาผังห้อง จองเครื่องคอมพิวเตอร์ และดูข้อมูลเฉพาะของตนเอง</span>
              )}
            </div>
          </div>

          {/* Right: Security info */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] underline text-slate-300 hover:text-white font-bold flex items-center gap-1"
            >
              <span>{expanded ? 'ซ่อนขอบเขตความปลอดภัย' : 'ตรวจสอบขอบเขตความปลอดภัย'}</span>
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
                <span>ขอบเขตข้อมูลที่อนุญาตให้เข้าถึง:</span>
              </div>
              <ul className="list-disc list-inside text-slate-200 space-y-1 pl-1">
                {isAdmin ? (
                  <>
                    <li>อนุมัติ หรือปฏิเสธรายการขอจองห้องและคอมพิวเตอร์</li>
                    <li>ล็อกตารางเรียนประจำสาขาสำหรับรายวิชาต่างๆ</li>
                    <li>เพิ่ม แก้ไข หรือปิดปรับปรุงห้องปฏิบัติการและเครื่อง PC</li>
                    <li>บริหารจัดการสมาชิก และเชื่อมตั้งค่า Google Sheets API</li>
                  </>
                ) : (
                  <>
                    <li>ตรวจสอบผังห้อง และสถานะว่าง/ใช้งาน ของเครื่อง PC แบบ Real-time</li>
                    <li>ยื่นเรื่องขอจองเครื่องคอมพิวเตอร์ตามรอบเวลาที่ต้องการ</li>
                    <li>ดูและพิมพ์ใบบันทึกการจอง (Booking Slip) เฉพาะของตนเอง</li>
                    <li>ดูข้อมูลโปรไฟล์และประวัติการทำรายการเฉพาะบัญชีตนเอง</li>
                  </>
                )}
              </ul>
            </div>

            {/* Access Restrictions / Security Guard */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>การคุ้มครองความปลอดภัยและความเป็นส่วนตัว:</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                {isAdmin ? (
                  <>
                    <li>การแก้ไขข้อมูลตารางเรียนและการปิดห้องจะมีผลกระทบกับระบบทันที</li>
                    <li>ควรตรวจสอบความถูกต้องก่อนอนุมัติหรือปฏิเสธรายการ</li>
                  </>
                ) : (
                  <>
                    <li><strong className="text-amber-300">ระบบรักษาความปลอดภัย:</strong> ป้องกันไม่ให้แสดงข้อมูลของผู้ดูแลระบบหรือผู้อื่น</li>
                    <li><strong className="text-amber-300">ข้อมูลส่วนบุคคล:</strong> แสดงเฉพาะประวัติและข้อมูลบัญชีที่กำลังเข้าสู่ระบบเท่านั้น</li>
                    <li><strong className="text-amber-300">ความปลอดภัยเว็บแอป:</strong> ไม่อนุญาตให้แก้ไขหรือเข้าถึงส่วนการบริหารจัดการ Admin</li>
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
