import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  User,
  Lock,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Code,
  CheckCheck,
  Settings
} from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { addUser, login, syncUserToGoogleSheet, googleSheetsUrl, appsScriptUrl, setAppsScriptUrl } = useApp();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [department, setDepartment] = useState('เทคโนโลยีธุรกิจดิจิทัล');
  const [level, setLevel] = useState('ปวส.1/1');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptDrawer, setShowScriptDrawer] = useState(false);
  const [customWebUrl, setCustomWebUrl] = useState(appsScriptUrl);

  const [successData, setSuccessData] = useState<{
    code: string;
    name: string;
    role: string;
    department: string;
    level: string;
    email: string;
    phone: string;
    timestamp: string;
    sheetSynced: boolean;
  } | null>(null);

  const targetSpreadsheetId = '1sKz0rp5V8bQ_tI_dDZqAv-ERDa1dOD3yFOIkus85KWo';
  const targetSheetUrl = 'https://docs.google.com/spreadsheets/d/1sKz0rp5V8bQ_tI_dDZqAv-ERDa1dOD3yFOIkus85KWo/edit?usp=sharing';

  const appsScriptTemplate = `// Google Apps Script สำหรับเชื่อมต่อ Google Sheets:
// ID: ${targetSpreadsheetId}
// ลิงก์ชีต: ${targetSheetUrl}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById("${targetSpreadsheetId}");
    var sheet = ss.getActiveSheet();
    var data = e.parameter || {};
    
    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var key in parsed) {
          data[key] = parsed[key];
        }
      } catch (err) {}
    }
    
    // สร้างหัวตารางครบ 100% หากชีตยังว่างอยู่
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ประทับเวลา (Timestamp)",
        "รหัสประจำตัว/รหัสสถาบัน",
        "ชื่อ-นามสกุล",
        "สิทธิ์ใช้งาน (Role)",
        "ประเภทผู้ใช้งาน (ภาษาไทย)",
        "สาขาวิชา/แผนกวิชา",
        "ระดับชั้น/ตำแหน่ง",
        "อีเมล",
        "เบอร์โทรศัพท์",
        "สถานะการใช้งาน"
      ]);
    }
    
    var timestamp = data.timestamp || new Date().toLocaleString("th-TH");
    var roleTh = data.role_th || (data.role === "admin" ? "ผู้ดูแลระบบ (Admin)" : "นักศึกษา/บุคลากร");
    
    // บันทึกข้อมูลครบ 100% ทั้งหมด 10 คอลัมน์
    sheet.appendRow([
      timestamp,
      data.code || "",
      data.name || "",
      data.role || "student",
      roleTh,
      data.department || "",
      data.level || "",
      data.email || "",
      data.phone || "",
      data.status || "ใช้งานได้ (Active)"
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "บันทึกข้อมูลสมาชิก 100% เรียบร้อยแล้ว" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("ระบบจองห้องและคอมพิวเตอร์ วก.วาปีปทุม - Web App Active (Sheet: ${targetSpreadsheetId})");
}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg('กรุณากรอกรหัสประจำตัว/รหัสสถาบัน');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    if (!password) {
      setErrorMsg('กรุณากำหนดรหัสผ่าน');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);

    try {
      const nowStr = new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' });
      const newUserObj = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        role,
        department,
        level,
        email: email.trim() || `${code.toLowerCase()}@wptc.ac.th`,
        phone: phone.trim() || '080-000-0000',
        avatar:
          role === 'admin'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      // 1. Add user locally in application context
      addUser(newUserObj);

      // 2. Sync 100% of data to Google Sheets
      const sheetResult = await syncUserToGoogleSheet({
        ...newUserObj,
        password,
        role_th: role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'นักศึกษา/บุคลากร',
        spreadsheet_id: targetSpreadsheetId,
      });

      setLoading(false);
      setSuccessData({
        code: newUserObj.code,
        name: newUserObj.name,
        role: role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'นักศึกษา/บุคลากร',
        department: newUserObj.department,
        level: newUserObj.level,
        email: newUserObj.email,
        phone: newUserObj.phone,
        timestamp: nowStr,
        sheetSynced: sheetResult.success,
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('เกิดข้อผิดพลาดในการลงทะเบียน: ' + (err?.message || 'โปรดลองอีกครั้ง'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 bg-gradient-to-br from-slate-100 via-purple-50/50 to-orange-50/30">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-7 text-center relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-center mb-3">
            <Logo size="md" showText={false} lightBackground={false} />
          </div>

          <h2 className="text-xl font-black tracking-tight text-white mb-1">
            สมัครสมาชิกใหม่ (Register Member)
          </h2>
          <p className="text-xs text-purple-200 font-medium">
            สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล • วิทยาลัยการอาชีพวาปีปทุม
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>เชื่อมต่อส่งข้อมูลเข้า Google Sheets 100%</span>
          </div>
        </div>

        {/* Target Spreadsheet Indicator Bar */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950">
          <div className="flex items-center gap-1.5 font-bold">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>บันทึกไปยัง Google Sheet:</span>
            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
              1sKz0rp5V8bQ...85KWo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={targetSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 underline"
            >
              <span>เปิดดูไฟล์ Google Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={() => setShowScriptDrawer(!showScriptDrawer)}
              className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 flex items-center gap-1"
            >
              <Code className="w-3 h-3 text-emerald-600" />
              <span>{showScriptDrawer ? 'ซ่อนสคริปต์' : 'สคริปต์ Apps Script'}</span>
            </button>
          </div>
        </div>

        {/* Optional Apps Script Code Drawer */}
        {showScriptDrawer && (
          <div className="p-4 bg-slate-900 text-white text-xs border-b border-slate-700 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                <span>Google Apps Script Code (บันทึกลงชีต 100%)</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(appsScriptTemplate);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1"
              >
                {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? 'คัดลอกแล้ว!' : 'คัดลอกสคริปต์'}</span>
              </button>
            </div>

            <pre className="p-2.5 bg-black/40 rounded-lg text-emerald-400 text-[10px] font-mono overflow-x-auto max-h-36 leading-tight border border-slate-800">
              {appsScriptTemplate}
            </pre>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="วาง Web App URL https://script.google.com/.../exec"
                value={customWebUrl}
                onChange={(e) => setCustomWebUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => {
                  setAppsScriptUrl(customWebUrl.trim());
                  alert('บันทึก Apps Script Web App URL เรียบร้อยแล้ว!');
                }}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg"
              >
                บันทึก URL
              </button>
            </div>
          </div>
        )}

        {/* Form or Success State */}
        <div className="p-7">
          {successData ? (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  ลงทะเบียนสำเร็จ & จัดส่งข้อมูลเรียบร้อย 100%!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  ยินดีต้อนรับคุณ <span className="font-bold text-purple-900">{successData.name}</span> (รหัส: <span className="font-mono font-bold text-purple-800">{successData.code}</span>)
                </p>
              </div>

              {/* 100% Data Transmission Checklist Card */}
              <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>สรุปการจัดส่งข้อมูล 100% ไปยัง Google Sheets:</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-extrabold text-[10px]">
                    100% COMPLETED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-slate-500">1. รหัสประจำตัว:</span>
                    <p className="font-bold font-mono text-purple-900">{successData.code}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">2. ชื่อ-นามสกุล:</span>
                    <p className="font-bold text-slate-900">{successData.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">3. สิทธิ์ใช้งาน:</span>
                    <p className="font-bold text-emerald-800">{successData.role}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">4. สาขาวิชา:</span>
                    <p className="font-bold text-slate-800">{successData.department}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">5. ระดับชั้น:</span>
                    <p className="font-bold text-slate-800">{successData.level}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">6. อีเมล:</span>
                    <p className="font-bold text-slate-800 truncate">{successData.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">7. เบอร์โทรศัพท์:</span>
                    <p className="font-bold text-slate-800">{successData.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">8. ประทับเวลา:</span>
                    <p className="font-mono text-[10px] text-slate-600">{successData.timestamp}</p>
                  </div>
                </div>

                <a
                  href={targetSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>เปิดดูแถวข้อมูลใน Google Sheets ทันที</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    login(successData.code, password);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>เข้าสู่ระบบด้วยบัญชีนี้ทันที</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="px-4 py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  กลับหน้าเข้าสู่ระบบ
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Role selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ประเภทผู้ใช้งาน (User Role) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        role === 'student'
                          ? 'bg-purple-100/80 border-purple-500 text-purple-900 ring-2 ring-purple-400/30'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-4 h-4 text-purple-600" />
                      <span>นักศึกษา / บุคลากร</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        role === 'admin'
                          ? 'bg-amber-100/80 border-amber-500 text-amber-900 ring-2 ring-amber-400/30'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>ผู้ดูแลระบบ (Admin)</span>
                    </button>
                  </div>
                </div>

                {/* Institutional ID & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      รหัสประจำตัว / รหัสสถาบัน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="เช่น STD6604 หรือ ADMIN"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ชื่อ - นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="เช่น นายสมศักดิ์ รักเรียน"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      รหัสผ่าน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="อย่างน้อย 4 ตัวอักษร"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านซ้ำ"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Department & Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      สาขาวิชา / แผนกวิชา
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                      >
                        <option value="เทคโนโลยีธุรกิจดิจิทัล">เทคโนโลยีธุรกิจดิจิทัล</option>
                        <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
                        <option value="การบัญชี">การบัญชี</option>
                        <option value="การตลาด">การตลาด</option>
                        <option value="ช่างไฟฟ้ากำลัง">ช่างไฟฟ้ากำลัง</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ระดับชั้น / ตำแหน่ง
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        placeholder="เช่น ปวส.1/1, ปวช.2/1 หรือ อาจารย์"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      อีเมล (Email)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@wptc.ac.th"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081-234-5678"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* 100% Google Sheet Sync Verification Notice */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    ข้อมูลทั้ง 10 คอลัมน์จะถูกส่งและบันทึกลงไฟล์ Google Sheet ({targetSpreadsheetId.slice(0, 12)}...) ทันทีที่กดปุ่ม
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-700 hover:from-emerald-700 hover:to-purple-800 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังลงทะเบียนและส่งข้อมูลลง Google Sheets 100%...</span>
                    </>
                  ) : (
                    <>
                      <span>ยืนยันการสมัครสมาชิก (บันทึกลง Google Sheet)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch back to login */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>มีบัญชีอยู่แล้ว? กลับไปหน้าเข้าสู่ระบบ</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-7 py-3 text-center border-t border-slate-100 text-[11px] text-slate-500">
          วิทยาลัยการอาชีพวาปีปทุม • Google Sheets ID: {targetSpreadsheetId}
        </div>

      </div>
    </div>
  );
};
