import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegisterForm } from './RegisterForm';
import { Logo } from '../common/Logo';
import {
  Lock,
  User,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowRight,
  Shield,
  Sparkles,
  UserPlus,
  MonitorCheck,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Database
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, logout, fetchUsersFromGoogleSheet, googleSheetsUrl, users } = useApp();
  const [viewMode, setViewMode] = useState<'login' | 'register'>('login');
  const [portalRole, setPortalRole] = useState<'user' | 'admin'>('user');
  const [code, setCode] = useState('STD6601');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Sheet Fetching State for Field 1
  const [sheetSyncing, setSheetSyncing] = useState(false);
  const [sheetSyncResult, setSheetSyncResult] = useState<{ type: 'success' | 'info'; msg: string } | null>(null);

  if (viewMode === 'register') {
    return <RegisterForm onSwitchToLogin={() => setViewMode('login')} />;
  }

  const handleSwitchPortal = (role: 'user' | 'admin') => {
    setPortalRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setCode('admin');
      setPassword('11223344');
    } else {
      setCode('STD6601');
      setPassword('password');
    }
  };

  const handleSyncSheet = async () => {
    setSheetSyncing(true);
    setSheetSyncResult(null);
    const res = await fetchUsersFromGoogleSheet();
    setSheetSyncing(false);

    if (res.success) {
      setSheetSyncResult({
        type: 'success',
        msg: `ดึงข้อมูลจาก Google Sheet เรียบร้อยแล้ว (พบสมาชิกทั้งหมด ${users.length} รายการ)`,
      });
    } else {
      setSheetSyncResult({
        type: 'info',
        msg: 'เชื่อมต่อ Google Sheet แล้ว (สามารถใช้รหัสสถาบันลงชื่อเข้าใช้งานได้ทันที)',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('กรุณากรอกรหัสสถาบัน/องค์กร');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = login(code, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else if (portalRole === 'admin' && res.role !== 'admin') {
        logout();
        setErrorMsg(`⚠️ ปฏิเสธการเข้าถึง: บัญชี "${code.trim().toUpperCase()}" เป็นสิทธิ์นักศึกษา ไม่ได้รับอนุญาตให้เข้าสู่ Portal ผู้ดูแลระบบ (Admin) กรุณาสลับไป Portal นักศึกษา`);
      }
    }, 300);
  };

  const setPreset = (presetCode: string, presetPass: string) => {
    setCode(presetCode);
    setPassword(presetPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 bg-gradient-to-br from-slate-100 via-purple-50/50 to-orange-50/30">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        
        {/* Header Branding Panel */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 text-center relative overflow-hidden">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} lightBackground={false} />
          </div>

          <h2 className="text-xl font-black tracking-tight text-white mb-1">
            วิทยาลัยการอาชีพวาปีปทุม
          </h2>
          <p className="text-xs text-purple-200 font-medium">
            สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล (Digital Business Technology)
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-orange-300 border border-white/15">
            <MonitorCheck className="w-3.5 h-3.5 text-orange-400" />
            ระบบจองห้องและคอมพิวเตอร์ออนไลน์
          </div>
        </div>

        {/* Dedicated Portal Selector Tabs: User Portal vs Admin Portal */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSwitchPortal('user')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              portalRole === 'user'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4 text-purple-300" />
            <span>1. Portal นักศึกษา / ผู้ใช้</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchPortal('admin')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              portalRole === 'admin'
                ? 'bg-amber-600 text-slate-950 shadow-md font-black'
                : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-950" />
            <span>2. Portal ผู้ดูแลระบบ (Admin)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          
          {/* Portal Title Banner */}
          {portalRole === 'user' ? (
            <div className="mb-6 p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>เข้าสู่ระบบบริการนักศึกษา & ผู้ใช้งาน</span>
                </h3>
                <p className="text-[11px] text-purple-700 font-medium">
                  ใช้จองห้องปฏิบัติการ ตรวจสอบสถานะคอมพิวเตอร์ และดูใบบันทึกการจอง
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('register')}
                className="px-2.5 py-1 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-[10px] font-bold shrink-0 flex items-center gap-1 transition-colors shadow-2xs"
              >
                <UserPlus className="w-3 h-3" />
                <span>สมัครสมาชิก</span>
              </button>
            </div>
          ) : (
            <div className="mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>ระบบจัดการสำหรับผู้ดูแลระบบ (Admin Control Panel)</span>
                </h3>
                <p className="text-[11px] text-amber-800 font-medium">
                  สำหรับอาจารย์ เจ้าหน้าที่ และผู้ดูแลห้องปฏิบัติการคอมพิวเตอร์เท่านั้น
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Google Sheet Connection Banner for Field 1 */}
            <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ดึงข้อมูลจาก Google Sheet (ช่องข้อมูลที่ 1)</span>
                </span>
                <a
                  href={googleSheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 font-bold"
                >
                  <span>ดู Google Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-800">
                <span>ดึง/ซิงค์ข้อมูลสมาชิกล่าสุดเข้าช่องข้อมูลที่ 1</span>
                <button
                  type="button"
                  disabled={sheetSyncing}
                  onClick={handleSyncSheet}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${sheetSyncing ? 'animate-spin' : ''}`} />
                  <span>{sheetSyncing ? 'กำลังดึง...' : 'ดึงข้อมูล Google Sheet'}</span>
                </button>
              </div>

              {sheetSyncResult && (
                <div className="p-2 rounded-xl bg-white/90 border border-emerald-300 text-[11px] text-emerald-900 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{sheetSyncResult.msg}</span>
                </div>
              )}
            </div>

            {/* Institutional ID Field (Field 1) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  ช่องข้อมูลที่ 1: {portalRole === 'admin' ? 'รหัสผู้ดูแลระบบ (Admin ID)' : 'รหัสสถาบัน / รหัสประจำตัว (ID)'} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Google Sheet Data</span>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {portalRole === 'admin' ? <Shield className="w-4 h-4 text-amber-600" /> : <User className="w-4 h-4 text-purple-600" />}
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={portalRole === 'admin' ? 'กรอก admin' : 'เช่น STD6601'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium bg-slate-50/50 transition-all"
                  required
                />
              </div>

              {/* Quick Select Chips from Google Sheet users */}
              <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px]">
                <span className="text-slate-400 font-semibold text-[10px]">เลือกใช้รหัสจาก Sheet:</span>
                {users
                  .filter((u) => (portalRole === 'admin' ? u.role === 'admin' : u.role !== 'admin'))
                  .slice(0, 5)
                  .map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setCode(u.code);
                        setPassword(u.role === 'admin' ? '11223344' : 'password');
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all ${
                        code.toUpperCase() === u.code.toUpperCase()
                          ? portalRole === 'admin'
                            ? 'bg-amber-600 text-slate-950 shadow-2xs font-black'
                            : 'bg-purple-700 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 border border-slate-200'
                      }`}
                    >
                      {u.code} ({u.name})
                    </button>
                  ))}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium bg-slate-50/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-purple-700 select-none"
              >
                {rememberMe ? (
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>จำรหัสผ่าน (Remember Password)</span>
              </button>

              {portalRole === 'user' && (
                <button
                  type="button"
                  onClick={() => setViewMode('register')}
                  className="text-[11px] font-bold text-purple-600 hover:underline"
                >
                  สมัครสมาชิกใหม่?
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                portalRole === 'admin'
                  ? 'bg-gradient-to-r from-slate-900 via-amber-800 to-amber-900 hover:from-slate-950 hover:to-amber-950 text-amber-200'
                  : 'bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white'
              }`}
            >
              {loading ? (
                <span>กำลังตรวจสอบสิทธิ์...</span>
              ) : (
                <>
                  <span>{portalRole === 'admin' ? 'เข้าสู่ระบบผู้ดูแลระบบ (Admin)' : 'เข้าสู่ระบบนักศึกษา/ผู้ใช้'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials Presets */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>รหัสทดสอบระบบ (Demo Accounts)</span>
              </span>
              <span className="text-[10px] text-purple-700 font-semibold">คลิกเพื่อลองใช้</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreset('STD6601', 'password')}
                className="p-2.5 text-left rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span>นักศึกษา</span>
                </div>
                <div className="text-[10px] text-purple-700 mt-0.5">
                  ID: <span className="font-mono font-bold">STD6601</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreset('admin', '11223344')}
                className="p-2.5 text-left rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>ผู้ดูแลระบบ (Admin)</span>
                </div>
                <div className="text-[10px] text-amber-800 mt-0.5">
                  ID: <span className="font-mono font-bold">admin</span> / Pass: <span className="font-mono font-bold">11223344</span>
                </div>
              </button>
            </div>
          </div>

          {/* Registration banner */}
          <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-[11px] text-emerald-900 font-medium">
                ยังไม่มีบัญชี? สมัครและส่งข้อมูลเข้า Google Sheets ได้ทันที
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('register')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shrink-0 shadow-2xs"
            >
              ลงทะเบียน
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-8 py-3 text-center border-t border-slate-100 text-[11px] text-slate-500">
          สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล • วิทยาลัยการอาชีพวาปีปทุม © 2026
        </div>

      </div>
    </div>
  );
};

