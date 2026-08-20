import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room, Computer, Booking, ClassSchedule, User, PCStatus } from '../../types';
import { BookingSlipModal } from '../modals/BookingSlipModal';
import { AppsScriptDetailImporter } from '../common/AppsScriptDetailImporter';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Monitor,
  Users,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Search,
  Wrench,
  Lock,
  Unlock,
  Building,
  AlertCircle,
  FileText,
  Printer,
  X,
  Sparkles,
  ChevronRight,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  Code,
  Send,
  Save,
  Link as LinkIcon
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    rooms,
    computers,
    bookings,
    schedules,
    defectReports,
    googleSheetsUrl,
    appsScriptUrl,
    setAppsScriptUrl,
    syncUserToGoogleSheet,
    approveBooking,
    rejectBooking,
    addScheduleLock,
    deleteScheduleLock,
    updatePcStatus,
    resolveDefect,
    addUser,
    updateUser,
    deleteUser,
    addRoom,
    updateRoom,
    deleteRoom,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'schedules' | 'rooms' | 'users' | 'details' | 'analytics'>('approvals');

  // Google Sheets Apps Script State
  const [scriptUrlInput, setScriptUrlInput] = useState(appsScriptUrl);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testSyncLoading, setTestSyncLoading] = useState(false);
  const [testSyncMsg, setTestSyncMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Approval Tab Filters
  const [approvalFilter, setApprovalFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectModalBooking, setRejectModalBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Schedule Lock Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schRoomId, setSchRoomId] = useState(rooms[0]?.id || 'rm-401');
  const [schDay, setSchDay] = useState(1); // Mon
  const [schStart, setSchStart] = useState('08:30');
  const [schEnd, setSchEnd] = useState('12:30');
  const [schSubjectCode, setSchSubjectCode] = useState('30204-2001');
  const [schSubjectName, setSchSubjectName] = useState('');
  const [schTeacher, setSchTeacher] = useState('ดร.วิชัย สอนดี');
  const [schGroup, setSchGroup] = useState('ปวส.1/1');

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [uCode, setUCode] = useState('');
  const [uName, setUName] = useState('');
  const [uRole, setURole] = useState<'student' | 'admin'>('student');
  const [uDept, setUDept] = useState('เทคโนโลยีธุรกิจดิจิทัล');
  const [uLevel, setULevel] = useState('ปวส.1/1');
  const [uEmail, setUEmail] = useState('');
  const [uPhone, setUPhone] = useState('');

  // Room Management State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [rCode, setRCode] = useState('');
  const [rName, setRName] = useState('');
  const [rTotalPcs, setRTotalPcs] = useState(30);
  const [rCapacity, setRCapacity] = useState(35);
  const [rBuilding, setRBuilding] = useState('อาคารวิทยบริการและสารสนเทศ');
  const [rFloor, setRFloor] = useState('ชั้น 4');

  // Printable Slip
  const [slipBooking, setSlipBooking] = useState<Booking | null>(null);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const handleApprove = (bookingId: string) => {
    approveBooking(bookingId, 'อนุมัติคำขอจองเรียบร้อยแล้ว');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalBooking) return;
    rejectBooking(rejectModalBooking.id, rejectReason || 'ไม่อนุมัติเนื่องจากมีเหตุจำเป็น');
    setRejectModalBooking(null);
    setRejectReason('');
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const roomObj = rooms.find((r) => r.id === schRoomId);
    addScheduleLock({
      roomId: schRoomId,
      roomName: roomObj?.code || schRoomId,
      dayOfWeek: Number(schDay),
      startTime: schStart,
      endTime: schEnd,
      subjectCode: schSubjectCode,
      subjectName: schSubjectName,
      teacherName: schTeacher,
      studentGroup: schGroup,
    });
    setShowScheduleModal(false);
    setSchSubjectName('');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser({
        ...editingUser,
        code: uCode,
        name: uName,
        role: uRole,
        department: uDept,
        level: uLevel,
        email: uEmail,
        phone: uPhone,
      });
    } else {
      addUser({
        code: uCode,
        name: uName,
        role: uRole,
        department: uDept,
        level: uLevel,
        email: uEmail || `${uCode.toLowerCase()}@wptc.ac.th`,
        phone: uPhone || '080-000-0000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom({
        ...editingRoom,
        code: rCode,
        name: rName,
        totalPcs: Number(rTotalPcs),
        capacity: Number(rCapacity),
        building: rBuilding,
        floor: rFloor,
      });
    } else {
      addRoom({
        code: rCode,
        name: rName,
        building: rBuilding,
        floor: rFloor,
        capacity: Number(rCapacity),
        totalPcs: Number(rTotalPcs),
        description: 'ห้องปฏิบัติการคอมพิวเตอร์และสารสนเทศ',
        status: 'available',
        managerName: currentUser?.name || 'หัวหน้าแผนก',
        softwareList: ['VS Code', 'Microsoft Office'],
      });
    }
    setShowRoomModal(false);
    setEditingRoom(null);
  };

  const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  // Analytics Data Calculation
  const roomStatsData = rooms.map((rm) => {
    const totalBooked = bookings.filter((b) => b.roomId === rm.id).length;
    return { name: rm.code, count: totalBooked };
  });

  const statusPieData = [
    { name: 'อนุมัติแล้ว', value: bookings.filter((b) => b.status === 'approved').length, color: '#10b981' },
    { name: 'รออนุมัติ', value: bookings.filter((b) => b.status === 'pending').length, color: '#f59e0b' },
    { name: 'ปฏิเสธ/ยกเลิก', value: bookings.filter((b) => b.status === 'rejected' || b.status === 'cancelled').length, color: '#ef4444' },
  ];

  const trendData = [
    { month: 'ม.ค.', bookings: 12 },
    { month: 'ก.พ.', bookings: 18 },
    { month: 'มี.ค.', bookings: 25 },
    { month: 'เม.ย.', bookings: 15 },
    { month: 'พ.ค.', bookings: 32 },
    { month: 'มิ.ย.', bookings: 45 },
    { month: 'ก.ค.', bookings: 58 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Dashboard Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>แผงควบคุมผู้ดูแลระบบ (ADMIN CONTROL PANEL)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              จัดการระบบจองห้องและคอมพิวเตอร์
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล • วิทยาลัยการอาชีพวาปีปทุม
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
            <div className="px-3 py-1">
              <div className="text-xl font-black text-amber-400">{pendingCount}</div>
              <div className="text-[10px] text-slate-300">รอการอนุมัติ</div>
            </div>
            <div className="px-3 py-1 border-x border-white/15">
              <div className="text-xl font-black text-emerald-400">{rooms.length}</div>
              <div className="text-[10px] text-slate-300">ห้องปฏิบัติการ</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-xl font-black text-purple-300">{defectReports.length}</div>
              <div className="text-[10px] text-slate-300">แจ้งชำรุด</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'approvals'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>1. อนุมัติการจอง</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'schedules'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>2. ล็อกตารางเรียนประจำ</span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'rooms'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>3. จัดการห้อง/เครื่อง</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'users'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. จัดการข้อมูลผู้ใช้</span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'details'
              ? 'bg-emerald-600 text-white shadow-md font-black'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          <span>5. ช่องข้อมูลที่ 2 (นำเข้ารายละเอียด Apps Script)</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>6. รายงานสถิติ</span>
        </button>
      </div>

      {/* SECTION 1: BOOKING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">
                อนุมัติและตรวจสอบการจอง (Booking Approval Queue)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ตรวจสอบคำขอจองห้องและเครื่องคอมพิวเตอร์จากนักศึกษา
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setApprovalFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  approvalFilter === 'pending'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                รออนุมัติ ({pendingCount})
              </button>
              <button
                onClick={() => setApprovalFilter('approved')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  approvalFilter === 'approved'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                อนุมัติแล้ว
              </button>
              <button
                onClick={() => setApprovalFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  approvalFilter === 'all'
                    ? 'bg-purple-700 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด
              </button>
            </div>
          </div>

          <div className="p-6">
            {bookings.filter((b) => approvalFilter === 'all' || b.status === approvalFilter).length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <div className="font-bold text-slate-600 text-sm">ไม่มีคำขอจองในหมวดนี้</div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bookings
                  .filter((b) => approvalFilter === 'all' || b.status === approvalFilter)
                  .map((bk) => (
                    <div key={bk.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {bk.bookingCode}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              bk.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : bk.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {bk.status === 'approved' && 'อนุมัติแล้ว'}
                            {bk.status === 'pending' && 'รออนุมัติ'}
                            {bk.status === 'rejected' && 'ปฏิเสธ'}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-900">
                          {bk.userName} ({bk.userCode}) • {bk.userLevel || 'นักศึกษา'} {bk.userDepartment}
                        </div>

                        <div className="text-xs text-slate-600 font-medium">
                          ห้อง: <span className="font-bold text-purple-900">{bk.roomName}</span> | เครื่อง:{' '}
                          <span className="font-mono font-bold">{bk.isFullRoom ? 'จองทั้งห้อง' : bk.pcNumbers.join(', ')}</span>
                        </div>

                        <div className="text-xs text-slate-500">
                          วันที่: {bk.bookingDate} | เวลา: {bk.startTime} - {bk.endTime} น.
                        </div>

                        <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                          เหตุผล: "{bk.purpose}"
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {bk.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(bk.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>อนุมัติ</span>
                            </button>

                            <button
                              onClick={() => setRejectModalBooking(bk)}
                              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold border border-red-200"
                            >
                              ปฏิเสธ
                            </button>
                          </>
                        )}

                        {bk.status === 'approved' && (
                          <button
                            onClick={() => setSlipBooking(bk)}
                            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold border border-purple-200 flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>ดู/พิมพ์ใบจอง</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: CLASS SCHEDULE LOCK */}
      {activeTab === 'schedules' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                ตารางเรียนประจำ / ล็อกห้องเรียน (Class Timetable Lock)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ล็อกช่วงเวลาการสอนประจำเพื่อป้องกันนักศึกษาจองซ้ำซ้อน
              </p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มตารางล็อกห้อง</span>
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-bold rounded">
                        วัน{dayNames[sch.dayOfWeek]}
                      </span>
                      <span className="font-mono font-bold text-slate-700">
                        {sch.startTime} - {sch.endTime} น.
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mt-1">
                      {sch.subjectCode} - {sch.subjectName}
                    </div>

                    <div className="text-slate-600">
                      ห้อง: <span className="font-bold text-purple-800">{sch.roomName}</span> | กลุ่มเรียน: {sch.studentGroup}
                    </div>

                    <div className="text-slate-500 text-[11px]">
                      ผู้สอน: {sch.teacherName}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteScheduleLock(sch.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="ปลดล็อก/ลบตาราง"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ROOM & COMPUTER STATUS MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
              จัดการห้องปฏิบัติการและเครื่องคอมพิวเตอร์
            </h2>
            <button
              onClick={() => {
                setEditingRoom(null);
                setRCode('');
                setRName('');
                setRTotalPcs(30);
                setShowRoomModal(true);
              }}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มห้องปฏิบัติการใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((rm) => {
              const rmPcs = computers.filter((c) => c.roomId === rm.id);
              const maintenancePcs = rmPcs.filter((c) => c.status === 'maintenance');

              return (
                <div key={rm.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-black text-xs rounded-lg">
                          {rm.code}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          ความจุ: {rm.totalPcs} เครื่อง
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{rm.name}</h3>
                      <p className="text-xs text-slate-500">{rm.building} • {rm.floor}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRoom(rm);
                          setRCode(rm.code);
                          setRName(rm.name);
                          setRTotalPcs(rm.totalPcs);
                          setRCapacity(rm.capacity);
                          setShowRoomModal(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRoom(rm.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* PC Status Matrix Bar */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                      <span>สถานะเครื่องคอมพิวเตอร์ในห้อง ({rmPcs.length} เครื่อง)</span>
                      {maintenancePcs.length > 0 && (
                        <span className="text-[10px] text-amber-700 font-extrabold bg-amber-100 px-2 py-0.5 rounded">
                          ชำรุด {maintenancePcs.length} เครื่อง
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                      {rmPcs.map((pc) => (
                        <button
                          key={pc.id}
                          onClick={() => {
                            const nextStatus: PCStatus =
                              pc.status === 'maintenance' ? 'available' : 'maintenance';
                            updatePcStatus(pc.id, nextStatus);
                          }}
                          className={`p-1 text-center rounded text-[10px] font-mono font-bold border ${
                            pc.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : pc.status === 'maintenance'
                              ? 'bg-amber-300 text-slate-900 border-amber-400 font-black'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                          title={`คลิกเพื่อสลับสถานะชำรุด/ว่าง (${pc.pcNumber})`}
                        >
                          {pc.pcNumber.replace('PC-', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Defect reports inside this room */}
                  {maintenancePcs.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-amber-600" />
                        <span>รายการแจ้งอุปกรณ์ชำรุด</span>
                      </div>
                      {maintenancePcs.map((m) => (
                        <div key={m.id} className="text-xs bg-white p-2.5 rounded-xl border border-amber-200 flex items-start justify-between">
                          <div>
                            <span className="font-bold text-amber-900">{m.pcNumber}: </span>
                            <span className="text-slate-700">{m.defectReport?.issueDescription || 'ปรับปรุงแก้ไข'}</span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              ผู้แจ้ง: {m.defectReport?.reportedBy || 'แอดมิน'}
                            </div>
                          </div>
                          {m.defectReport && (
                            <button
                              onClick={() => resolveDefect(m.defectReport!.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                            >
                              ซ่อมเสร็จ
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: USER ACCOUNT MANAGEMENT & GOOGLE SHEETS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Google Sheets Integration Control Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-4 border border-emerald-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      การเชื่อมต่อ Google Sheets & Apps Script
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                      Google Sheet Active
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    บันทึกข้อมูลการสมัครสมาชิกของนักศึกษาส่งตรงไปยัง Google Sheets หลักของวิทยาลัย
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={googleSheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดไฟล์ Google Sheet</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowScriptModal(true)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5 text-amber-300" />
                  <span>ดูสคริปต์ & คู่มือติดตั้ง</span>
                </button>
              </div>
            </div>

            {/* Web App URL Input Form */}
            <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Apps Script Web App URL (สำหรับรับข้อมูลการสมัคร)</span>
                </label>

                {appsScriptUrl ? (
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    ✓ เชื่อมต่อ URL เรียบร้อยแล้ว
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    ! ยังไม่ได้วาง Web App URL
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="วางลิงก์ https://script.google.com/macros/s/.../exec ที่สร้างจาก Apps Script"
                  value={scriptUrlInput}
                  onChange={(e) => setScriptUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                />

                <button
                  type="button"
                  onClick={() => {
                    setAppsScriptUrl(scriptUrlInput.trim());
                    setTestSyncMsg({ type: 'success', text: 'บันทึก Web App URL เรียบร้อยแล้ว' });
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึก URL</span>
                </button>

                <button
                  type="button"
                  disabled={testSyncLoading}
                  onClick={async () => {
                    setTestSyncLoading(true);
                    setTestSyncMsg(null);
                    const testRes = await syncUserToGoogleSheet({
                      code: 'TEST-' + Math.floor(Math.random() * 1000),
                      name: 'ทดสอบการส่งข้อมูล Apps Script',
                      role: 'student',
                      department: 'เทคโนโลยีธุรกิจดิจิทัล',
                      level: 'ทดสอบระบบ',
                      email: 'test@wptc.ac.th',
                      phone: '080-000-0000',
                    });
                    setTestSyncLoading(false);
                    if (testRes.success) {
                      setTestSyncMsg({ type: 'success', text: 'ส่งข้อมูลทดสอบสำเร็จ! ตรวจสอบที่แถวใหม่ใน Google Sheet' });
                    } else {
                      setTestSyncMsg({ type: 'error', text: 'เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (testRes.error || 'โปรดตรวจสอบ URL') });
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testSyncLoading ? 'กำลังส่ง...' : 'ทดสอบส่งข้อมูล'}</span>
                </button>
              </div>

              {testSyncMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    testSyncMsg.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{testSyncMsg.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Account Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>จัดการข้อมูลสมาชิกและสิทธิ์การใช้งาน (Member Management)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  สิทธิ์แก้ไขข้อมูลเฉพาะผู้ดูแลระบบ (Admin) เท่านั้น • บัญชีผู้ดูแลระบบปัจจุบัน: <span className="font-mono font-bold text-purple-900">admin</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ หรือรหัสประจำตัว..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingUser(null);
                    setUCode('');
                    setUName('');
                    setURole('student');
                    setShowUserModal(true);
                  }}
                  className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มสมาชิกใหม่</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3.5">สมาชิก</th>
                    <th className="p-3.5">รหัสประจำตัว</th>
                    <th className="p-3.5">สิทธิ์ใช้งาน</th>
                    <th className="p-3.5">สาขา / ชั้น</th>
                    <th className="p-3.5">ติดต่อ</th>
                    <th className="p-3.5">การจัดการ (Admin Only)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter(
                      (u) =>
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.code.toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-purple-200"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-700">{u.code}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {u.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักศึกษา'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {u.department} {u.level && `(${u.level})`}
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {u.phone}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setUCode(u.code);
                                setUName(u.name);
                                setURole(u.role);
                                setUDept(u.department);
                                setULevel(u.level || '');
                                setUEmail(u.email);
                                setUPhone(u.phone);
                                setShowUserModal(true);
                              }}
                              className="p-1.5 text-purple-700 hover:bg-purple-50 rounded-lg flex items-center gap-1 font-bold text-[11px]"
                              title="แก้ไขข้อมูลสมาชิก"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>แก้ไข</span>
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1 font-bold text-[11px]"
                              title="ลบสมาชิก"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ลบ</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 5: STATISTICAL ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bar Chart: Most Booked Rooms */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>จำนวนการจองแยกตามห้องปฏิบัติการ (Top Booked Labs)</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" h="100%" height={250}>
                  <BarChart data={roomStatsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7e22ce" radius={[8, 8, 0, 0]} name="จำนวนการจอง" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Booking Status Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-orange-500" />
                <span>สัดส่วนสถานะการจอง (Booking Status Ratio)</span>
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Line Chart: Monthly Utilization Trend */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-sm">
              แนวโน้มการใช้งานห้องปฏิบัติการรายเดือน (Monthly Usage Trend)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#ea580c" strokeWidth={3} dot={{ r: 5 }} name="จำนวนการใช้" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: APPS SCRIPT DETAIL IMPORTER (FIELD 2) */}
      {activeTab === 'details' && <AppsScriptDetailImporter />}

      {/* Reject Modal */}
      {rejectModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900">ระบุเหตุผลในการปฏิเสธคำขอจอง</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="เช่น ติดตารางสอนประจำ หรือเครื่องงดให้บริการ..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalBooking(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between font-bold text-sm">
              <span>เพิ่มตารางสอนประจำ (ล็อกห้อง)</span>
              <button onClick={() => setShowScheduleModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">ห้องปฏิบัติการ</label>
                <select value={schRoomId} onChange={(e) => setSchRoomId(e.target.value)} className="w-full p-2 border rounded-xl">
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>{r.code} - {r.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">วัน</label>
                  <select value={schDay} onChange={(e) => setSchDay(Number(e.target.value))} className="w-full p-2 border rounded-xl">
                    <option value={1}>วันจันทร์</option>
                    <option value={2}>วันอังคาร</option>
                    <option value={3}>วันพุธ</option>
                    <option value={4}>วันพฤหัสบดี</option>
                    <option value={5}>วันศุกร์</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">เวลาเริ่ม - สิ้นสุด</label>
                  <div className="flex items-center gap-1">
                    <input type="text" value={schStart} onChange={(e) => setSchStart(e.target.value)} className="w-1/2 p-2 border rounded-xl" />
                    <span>-</span>
                    <input type="text" value={schEnd} onChange={(e) => setSchEnd(e.target.value)} className="w-1/2 p-2 border rounded-xl" />
                  </div>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">ชื่อรายวิชา</label>
                <input type="text" value={schSubjectName} onChange={(e) => setSchSubjectName(e.target.value)} placeholder="เช่น การพัฒนาเว็บแอปพลิเคชัน" className="w-full p-2 border rounded-xl" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-purple-700 text-white font-bold rounded-xl">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between font-bold text-sm">
              <span>{editingUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}</span>
              <button onClick={() => setShowUserModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">รหัสประจำตัว (Institutional ID)</label>
                <input type="text" value={uCode} onChange={(e) => setUCode(e.target.value)} className="w-full p-2 border rounded-xl" required />
              </div>
              <div>
                <label className="font-bold">ชื่อ-นามสกุล</label>
                <input type="text" value={uName} onChange={(e) => setUName(e.target.value)} className="w-full p-2 border rounded-xl" required />
              </div>
              <div>
                <label className="font-bold">สิทธิ์การใช้งาน</label>
                <select value={uRole} onChange={(e) => setURole(e.target.value as any)} className="w-full p-2 border rounded-xl">
                  <option value="student">นักศึกษา (Student)</option>
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-purple-700 text-white font-bold rounded-xl">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between font-bold text-sm">
              <span>{editingRoom ? 'แก้ไขข้อมูลห้อง' : 'เพิ่มห้องปฏิบัติการใหม่'}</span>
              <button onClick={() => setShowRoomModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveRoom} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">รหัสห้อง (Code)</label>
                <input type="text" value={rCode} onChange={(e) => setRCode(e.target.value)} placeholder="LAB-405" className="w-full p-2 border rounded-xl" required />
              </div>
              <div>
                <label className="font-bold">ชื่อห้องปฏิบัติการ</label>
                <input type="text" value={rName} onChange={(e) => setRName(e.target.value)} placeholder="ห้องปฏิบัติการ AI" className="w-full p-2 border rounded-xl" required />
              </div>
              <div>
                <label className="font-bold">จำนวนเครื่องคอมพิวเตอร์</label>
                <input type="number" value={rTotalPcs} onChange={(e) => setRTotalPcs(Number(e.target.value))} className="w-full p-2 border rounded-xl" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-purple-700 text-white font-bold rounded-xl">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Apps Script Code & Deployment Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-800">
                  ซอร์สโค้ด Google Apps Script & ขั้นตอนติดตั้ง
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScriptModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps List */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ขั้นตอนการเชื่อมต่อกับ Google Sheet (5 ขั้นตอนง่ายๆ):</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 marker:font-bold marker:text-emerald-700">
                <li>
                  เปิดไฟล์ Google Sheet ที่ต้องการเก็บข้อมูล:{' '}
                  <a
                    href={googleSheetsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>คลิกเพื่อเปิด Google Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>ไปที่เมนูด้านบนเลือก <strong>ส่วนขยาย (Extensions)</strong> &gt; <strong>สคริปต์แอป (Apps Script)</strong></li>
                <li>ลบโค้ดเดิมออกทั้งหมด แล้วนำโค้ดด้านล่างนี้ไปวางแทนที่</li>
                <li>
                  กดปุ่ม <strong>ทำให้ใช้งานได้ (Deploy)</strong> &gt; <strong>การทำให้ใช้งานได้ใหม่ (New deployment)</strong>
                  เลือกประเภทเป็น <strong>เว็บแอป (Web app)</strong> และกำหนด <strong>ผู้มีสิทธิ์เข้าถึง (Who has access)</strong> เป็น <strong>ทุกคน (Anyone)</strong>
                </li>
                <li>คัดลอก URL ของเว็บแอป (Web App URL) นำมาวางในช่องรับ URL ในหน้านี้แล้วกด <strong>"บันทึก URL"</strong></li>
              </ol>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <div className="flex items-center justify-between bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-2 rounded-t-2xl border-b border-slate-800">
                <span>GoogleAppsScript.gs</span>
                <button
                  type="button"
                  onClick={() => {
                    const codeText = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter || {};
    
    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var key in parsed) {
          data[key] = parsed[key];
        }
      } catch (err) {}
    }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ประทับเวลา (Timestamp)",
        "รหัสประจำตัว",
        "ชื่อ-นามสกุล",
        "สิทธิ์ใช้งาน",
        "สาขาวิชา",
        "ระดับชั้น/ตำแหน่ง",
        "อีเมล",
        "เบอร์โทรศัพท์",
        "สถานะ"
      ]);
    }
    
    var timestamp = data.timestamp || new Date().toLocaleString("th-TH");
    var roleName = data.role === "admin" ? "ผู้ดูแลระบบ (Admin)" : "นักศึกษา/บุคลากร";
    
    sheet.appendRow([
      timestamp,
      data.code || "",
      data.name || "",
      roleName,
      data.department || "",
      data.level || "",
      data.email || "",
      data.phone || "",
      "อนุมัติแล้ว"
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "บันทึกสมาชิกสำเร็จ" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("ระบบจองห้องและคอมพิวเตอร์ WPTC - Apps Script Active");
}`;
                    navigator.clipboard.writeText(codeText);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-sans font-bold text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'คัดลอกเรียบร้อย!' : 'คัดลอกสคริปต์'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-b-2xl overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
{`function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter || {};
    
    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var key in parsed) {
          data[key] = parsed[key];
        }
      } catch (err) {}
    }
    
    // สร้างหัวตารางให้อัตโนมัติหากชีตยังว่างอยู่
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ประทับเวลา (Timestamp)",
        "รหัสประจำตัว",
        "ชื่อ-นามสกุล",
        "สิทธิ์ใช้งาน",
        "สาขาวิชา",
        "ระดับชั้น/ตำแหน่ง",
        "อีเมล",
        "เบอร์โทรศัพท์",
        "สถานะ"
      ]);
    }
    
    var timestamp = data.timestamp || new Date().toLocaleString("th-TH");
    var roleName = data.role === "admin" ? "ผู้ดูแลระบบ (Admin)" : "นักศึกษา/บุคลากร";
    
    sheet.appendRow([
      timestamp,
      data.code || "",
      data.name || "",
      roleName,
      data.department || "",
      data.level || "",
      data.email || "",
      data.phone || "",
      "อนุมัติแล้ว"
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "บันทึกสมาชิกสำเร็จ" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("ระบบจองห้องและคอมพิวเตอร์ WPTC - Apps Script Active");
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowScriptModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Slip Modal */}
      {slipBooking && (
        <BookingSlipModal booking={slipBooking} onClose={() => setSlipBooking(null)} />
      )}

    </div>
  );
};
