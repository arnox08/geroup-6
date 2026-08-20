import React from 'react';
import { Booking } from '../../types';
import { Logo } from '../common/Logo';
import { X, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface BookingSlipModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingSlipModal: React.FC<BookingSlipModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm">ใบอนุญาตการจองใช้งานห้องปฏิบัติการ</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบจอง (Print Slip)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div id="printable-slip" className="p-8 bg-white text-slate-800">
          
          {/* Header Stamp */}
          <div className="border-b-2 border-purple-900 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <Logo size="lg" showText={true} />
              
              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-900 text-xs font-black rounded border border-purple-300 uppercase tracking-widest mb-1">
                  OFFICIAL SLIP
                </div>
                <div className="text-xs font-mono font-bold text-slate-600">
                  เลขที่เอกสาร: <span className="text-purple-700">{booking.bookingCode}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  วันที่ออกเอกสาร: {booking.createdAt}
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                ใบอนุญาตใช้งานห้องและเครื่องคอมพิวเตอร์
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                วิทยาลัยการอาชีพวาปีปทุม • สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล (DBT)
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6 flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">สถานะการอนุมัติ</div>
                <div className="text-sm font-black text-emerald-700 uppercase">
                  {booking.status === 'approved' ? 'อนุมัติเรียบร้อยแล้ว (APPROVED)' : booking.status}
                </div>
              </div>
            </div>

            {booking.approvedBy && (
              <div className="text-right text-xs">
                <div className="text-slate-400 text-[10px]">ผู้อนุมัติ</div>
                <div className="font-bold text-slate-700">{booking.approvedBy}</div>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs mb-8">
            
            {/* User Info */}
            <div className="space-y-2 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <div className="font-bold text-purple-900 border-b border-purple-200 pb-1 uppercase tracking-wider text-[11px]">
                ข้อมูลผู้ขอใช้งาน
              </div>
              <div>
                <span className="text-slate-500">ชื่อ-นามสกุล: </span>
                <span className="font-bold text-slate-800">{booking.userName}</span>
              </div>
              <div>
                <span className="text-slate-500">รหัสนักศึกษา: </span>
                <span className="font-mono font-bold text-slate-800">{booking.userCode}</span>
              </div>
              <div>
                <span className="text-slate-500">ระดับชั้น / สาขา: </span>
                <span className="font-medium text-slate-800">{booking.userLevel || '-'} • {booking.userDepartment}</span>
              </div>
            </div>

            {/* Room & Time Info */}
            <div className="space-y-2 p-4 bg-orange-50/40 rounded-xl border border-orange-100">
              <div className="font-bold text-orange-950 border-b border-orange-200 pb-1 uppercase tracking-wider text-[11px]">
                ข้อมูลการจองห้องปฏิบัติการ
              </div>
              <div>
                <span className="text-slate-500">ห้องปฏิบัติการ: </span>
                <span className="font-bold text-purple-900">{booking.roomName}</span>
              </div>
              <div>
                <span className="text-slate-500">หมายเลขเครื่อง: </span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-orange-200">
                  {booking.isFullRoom ? 'จองทั้งห้องปฏิบัติการ (Full Room)' : booking.pcNumbers.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500">วันที่ใช้งาน: </span>
                <span className="font-bold text-slate-800">{booking.bookingDate}</span>
              </div>
              <div>
                <span className="text-slate-500">ช่วงเวลา: </span>
                <span className="font-bold text-orange-700">{booking.startTime} - {booking.endTime} น.</span>
              </div>
            </div>

          </div>

          {/* Purpose */}
          <div className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              วัตถุประสงค์ / เหตุผลการใช้งาน
            </div>
            <div className="text-xs font-medium text-slate-800 italic">
              "{booking.purpose}"
            </div>
          </div>

          {/* Footer Signature & Verification Barcode */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                <div>VERIFIED BY WPTC DBT LAB SYSTEM</div>
                <div>CODE: {booking.bookingCode}</div>
                <div>DIGITAL STAMP: OK-2026-AUTH</div>
              </div>
            </div>

            <div className="text-center w-48">
              <div className="border-b border-slate-400 border-dashed h-10 mb-1 flex items-end justify-center pb-1">
                <span className="font-serif italic text-xs text-purple-900">{booking.approvedBy || 'ดร.วิชัย สอนดี'}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-700">
                ( {booking.approvedBy || 'อาจารย์ผู้ดูแลห้องปฏิบัติการ'} )
              </div>
              <div className="text-[10px] text-slate-400">
                อาจารย์ประจำสาขาเทคโนโลยีธุรกิจดิจิทัล
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
