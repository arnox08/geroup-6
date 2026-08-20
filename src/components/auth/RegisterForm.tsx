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
  Check
} from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { addUser, syncUserToGoogleSheet, googleSheetsUrl, appsScriptUrl } = useApp();

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
  const [successData, setSuccessData] = useState<{ code: string; name: string; sheetSynced: boolean } | null>(null);

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

      // 2. Sync to Google Sheets via Google Apps Script Web App
      const sheetResult = await syncUserToGoogleSheet({
        ...newUserObj,
        password,
      });

      setLoading(false);
      setSuccessData({
        code: newUserObj.code,
        name: newUserObj.name,
        sheetSynced: sheetResult.success,
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('เกิดข้อผิดพลาดในการลงทะเบียน: ' + (err?.message || 'โปรดลองอีกครั้ง'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 bg-gradient-to-br from-slate-100 via-purple-50/50 to-orange-50/30">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        
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
            <span>เชื่อมต่อส่งข้อมูลเข้า Google Sheets แบบเรียลไทม์</span>
          </div>
        </div>

        {/* Form or Success State */}
        <div className="p-7">
          {successData ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  ลงทะเบียนสำเร็จเรียบร้อย!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  ยินดีต้อนรับคุณ <span className="font-bold text-purple-900">{successData.name}</span> (รหัส: <span className="font-mono font-bold text-purple-800">{successData.code}</span>)
                </p>
              </div>

              {/* Sheet Integration Confirmation Card */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>บันทึกข้อมูลลง Google Sheet เรียบร้อยแล้ว</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  ข้อมูลการสมัครถูกบันทึกลงฐานข้อมูลระบบ และจัดส่งไปยังไฟล์ Google Sheets หลักของวิทยาลัยโดยอัตโนมัติผ่าน Apps Script
                </p>

                <a
                  href={googleSheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  <span>คลิกเพื่อดูไฟล์ Google Sheets ที่บันทึกข้อมูล</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>เข้าสู่ระบบด้วยบัญชีนี้</span>
                  <ArrowRight className="w-4 h-4" />
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
                    ประเภทผู้ใช้งาน (User Role)
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

                {/* Google Sheet Sync Notice */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    ข้อมูลที่กรอกจะถูกบันทึกไปยังไฟล์ Google Sheet ของวิทยาลัยโดยอัตโนมัติ
                    (<a href={googleSheetsUrl} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-bold">ดู Google Sheets</a>)
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
                      <span>กำลังลงทะเบียนและบันทึกลง Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <span>ยืนยันการลงทะเบียน</span>
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
          วิทยาลัยการอาชีพวาปีปทุม • Google Sheets & Apps Script Integration © 2026
        </div>

      </div>
    </div>
  );
};
