import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Send,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Calendar,
  ExternalLink,
  Database,
  Sparkles,
  Search,
  Code
} from 'lucide-react';

export const AppsScriptDetailImporter: React.FC = () => {
  const { importedDetails, importDetailDataToAppsScript, googleSheetsUrl, appsScriptUrl } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('รายละเอียดการจองห้อง/คอมพิวเตอร์');
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);

  const handleSubmitImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setSubmitMsg({ type: 'error', text: 'กรุณากรอกหัวข้อรายละเอียดและเนื้อหาให้ครบถ้วน' });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);

    const res = await importDetailDataToAppsScript({
      title: title.trim(),
      category,
      content: content.trim(),
      note: note.trim(),
    });

    setSubmitting(false);

    if (res.success) {
      setSubmitMsg({
        type: 'success',
        text: 'นำเข้าข้อมูลรายละเอียดผ่าน Apps Script เรียบร้อยแล้ว (บันทึกลง Google Sheet)',
      });
      setTitle('');
      setContent('');
      setNote('');
      setTimeout(() => setShowImportForm(false), 2000);
    } else {
      setSubmitMsg({
        type: 'error',
        text: res.error || 'เกิดข้อผิดพลาดในการนำเข้าข้อมูลผ่าน Apps Script',
      });
    }
  };

  const filteredDetails = importedDetails.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl p-6 text-white space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
                ช่องข้อมูลที่ 2
              </span>
              <h2 className="text-base font-black text-white">
                หน้าแสดงรายละเอียด & นำเข้าข้อมูลผ่าน Apps Script
              </h2>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1">
              นำเข้าข้อมูลรายละเอียดด้วยตนเอง แล้วส่งตรงไปยัง Google Sheet ผ่าน Google Apps Script API
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={googleSheetsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิด Google Sheet</span>
            </a>

            <button
              type="button"
              onClick={() => setShowImportForm(!showImportForm)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showImportForm ? 'ซ่อนฟอร์มนำเข้า' : '+ นำเข้าข้อมูลรายละเอียด'}</span>
            </button>
          </div>
        </div>

        {appsScriptUrl ? (
          <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Apps Script URL: {appsScriptUrl}</span>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>เชื่อมต่อโหมดจำลอง (ระบบจะบันทึกรายละเอียดไว้ในแอป และพร้อมส่งทันทีเมื่อระบุ Apps Script URL)</span>
          </div>
        )}
      </div>

      {/* Import Form Modal or Collapsible Section */}
      {showImportForm && (
        <form onSubmit={handleSubmitImport} className="p-5 bg-slate-50 rounded-2xl border border-emerald-200 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>ฟอร์มนำเข้าข้อมูลรายละเอียดผ่าน Google Apps Script (ช่องข้อมูลที่ 2)</span>
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              Manual Import Mode
            </span>
          </div>

          {submitMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                submitMsg.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                หัวข้อรายละเอียด (Title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น รายละเอียดการขอใช้อุปกรณ์คอมพิวเตอร์เพิ่มเติม"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                หมวดหมู่รายละเอียด (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
              >
                <option value="รายละเอียดการจองห้อง/คอมพิวเตอร์">รายละเอียดการจองห้อง/คอมพิวเตอร์</option>
                <option value="ระเบียบและข้อปฏิบัติตาม">ระเบียบและข้อปฏิบัติตาม</option>
                <option value="รายการอุปกรณ์ในห้องปฏิบัติการ">รายการอุปกรณ์ในห้องปฏิบัติการ</option>
                <option value="บันทึกการส่งงาน/กิจกรรม">บันทึกการส่งงาน/กิจกรรม</option>
                <option value="รายละเอียดอื่นๆ">รายละเอียดอื่นๆ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เนื้อหารายละเอียด (Detail Content) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="กรอกรายละเอียดที่ต้องการนำเข้า เช่น สเปกเครื่อง, รายการแจ้งซ่อม, วัตถุประสงค์การจอง..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุเพิ่มเติม (Optional Note)
            </label>
            <input
              type="text"
              placeholder="หมายเหตุ หรือบันทึกอ้างอิงเพิ่มเติม..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowImportForm(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'กำลังนำเข้าข้อมูล...' : 'ส่งนำเข้าผ่าน Apps Script'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Details Search & List Display */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              รายการข้อมูลรายละเอียดทั้งหมด ({importedDetails.length})
            </h3>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาตามหัวข้อ หรือหมวดหมู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium w-full sm:w-60"
            />
          </div>
        </div>

        {filteredDetails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600">ยังไม่พบข้อมูลรายละเอียดที่ตรงตามเงื่อนไข</p>
            <p className="text-[11px]">กดปุ่ม "+ นำเข้าข้อมูลรายละเอียด" เพื่อเพิ่มรายการข้อมูลลงใน Google Sheet ผ่าน Apps Script</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDetails.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center gap-1 shrink-0">
                    <Tag className="w-3 h-3 text-emerald-600" />
                    <span>{item.category}</span>
                  </span>

                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{item.createdAt}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {item.content}
                </p>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ส่งข้อมูลผ่าน Google Apps Script</span>
                  </span>

                  <span className="font-mono text-slate-400">ID: {item.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
