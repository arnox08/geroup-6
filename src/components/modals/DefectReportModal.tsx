import React, { useState } from 'react';
import { Computer, Room } from '../../types';
import { useApp } from '../../context/AppContext';
import { Wrench, AlertTriangle, X, Send } from 'lucide-react';

interface DefectReportModalProps {
  computer: Computer | null;
  room: Room | null;
  onClose: () => void;
}

export const DefectReportModal: React.FC<DefectReportModalProps> = ({ computer, room, onClose }) => {
  const { reportPcIssue } = useApp();
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!computer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    reportPcIssue(computer.id, issue);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-500 text-white">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-100" />
            <h3 className="font-bold text-sm">แจ้งคอมพิวเตอร์ชำรุด / ปรับปรุง</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-amber-600 rounded-lg text-amber-100 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">บันทึกการแจ้งชำรุดเรียบร้อย</h4>
              <p className="text-xs text-slate-500">
                สถานะเครื่อง {computer.pcNumber} ในห้อง {room?.code} ถูกเปลี่ยนเป็น "แจ้งชำรุด/ปรับปรุง" เรียบร้อยแล้ว
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* PC Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">ห้องปฏิบัติการ:</span>
                  <span className="text-purple-800 font-extrabold">{room?.name} ({room?.code})</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600">หมายเลขเครื่อง:</span>
                  <span className="text-amber-700 font-mono text-sm">{computer.pcNumber}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 pt-1 border-t border-slate-200">
                  สเปก: {computer.specs}
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  อาการชำรุด / ปัญหาที่พบ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="เช่น หน้าจอดับ, เมาส์คลิกไม่ติด, คีย์บอร์ดปุ่มกดค้าง, โปรแกรมเปิดไม่ได้"
                  rows={4}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรายงานแจ้งซ่อม</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
