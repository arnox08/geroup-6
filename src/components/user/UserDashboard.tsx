import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room, Computer, Booking } from '../../types';
import { BookingSlipModal } from '../modals/BookingSlipModal';
import { DefectReportModal } from '../modals/DefectReportModal';
import { AppsScriptDetailImporter } from '../common/AppsScriptDetailImporter';
import {
  Monitor,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Printer,
  X,
  Send,
  PlusCircle,
  Filter,
  Info,
  Check,
  Building,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { currentUser, rooms, computers, bookings, createBooking, cancelBooking, schedules } = useApp();
  
  const [activeTab, setActiveTab] = useState<'map' | 'form' | 'history' | 'details'>('map');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || 'rm-401');
  
  // Floor Plan PC Selection for Booking
  const [selectedPcs, setSelectedPcs] = useState<string[]>([]);
  const [filterPcStatus, setFilterPcStatus] = useState<string>('all');
  
  // Modals
  const [selectedSlipBooking, setSelectedSlipBooking] = useState<Booking | null>(null);
  const [reportingPc, setReportingPc] = useState<Computer | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [timeSlot, setTimeSlot] = useState<string>('13:00-15:00');
  const [formRoomId, setFormRoomId] = useState<string>(rooms[0]?.id || 'rm-401');
  const [formIsFullRoom, setFormIsFullRoom] = useState<boolean>(false);
  const [formPcNumbers, setFormPcNumbers] = useState<string[]>(['PC-01']);
  const [purpose, setPurpose] = useState<string>('');
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const roomComputers = computers.filter((c) => c.roomId === selectedRoomId);

  const filteredComputers = roomComputers.filter((c) => {
    if (filterPcStatus === 'all') return true;
    return c.status === filterPcStatus;
  });

  // User's own bookings
  const myBookings = bookings.filter((b) => b.userId === currentUser?.id);

  // Toggle PC selection for booking
  const togglePcSelection = (pcNum: string) => {
    if (selectedPcs.includes(pcNum)) {
      setSelectedPcs(selectedPcs.filter((p) => p !== pcNum));
    } else {
      setSelectedPcs([...selectedPcs, pcNum]);
    }
  };

  const handleStartBookingWithPcs = () => {
    setFormRoomId(selectedRoomId);
    setFormPcNumbers(selectedPcs.length > 0 ? selectedPcs : ['PC-01']);
    setFormIsFullRoom(false);
    setActiveTab('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setFormMsg(null);

    const [start, end] = timeSlot.split('-');
    const selectedRoomObj = rooms.find((r) => r.id === formRoomId);

    const res = createBooking({
      userId: currentUser.id,
      userCode: currentUser.code,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      userLevel: currentUser.level,
      roomId: formRoomId,
      roomName: selectedRoomObj ? `${selectedRoomObj.code} (${selectedRoomObj.name})` : formRoomId,
      pcNumbers: formIsFullRoom ? [] : formPcNumbers,
      isFullRoom: formIsFullRoom,
      bookingDate,
      startTime: start,
      endTime: end,
      purpose,
    });

    if (res.success) {
      setFormMsg({ type: 'success', text: res.message });
      setPurpose('');
      setSelectedPcs([]);
      setTimeout(() => {
        setActiveTab('history');
      }, 1500);
    } else {
      setFormMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Quick Navigation Sub-Tabs */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-purple-600/10 backdrop-blur-3xl rounded-l-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-3 border border-white/15">
              <UserCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>ยินดีต้อนรับนักศึกษา • {currentUser?.department}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ระบบจองห้องปฏิบัติการและคอมพิวเตอร์
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
              สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล (DBT) วิทยาลัยการอาชีพวาปีปทุม
            </p>
          </div>

          {/* Quick Tab Buttons */}
          <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'map'
                  ? 'bg-white text-purple-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>ผังห้อง Real-time</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-white text-purple-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>ส่งฟอร์มการจอง</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                activeTab === 'history'
                  ? 'bg-white text-purple-900 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>ประวัติการจอง</span>
              {myBookings.length > 0 && (
                <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                  {myBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>ช่องข้อมูลที่ 2 (นำเข้ารายละเอียด Apps Script)</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: REAL-TIME INTERACTIVE FLOOR PLAN & COMPUTERS */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          
          {/* Room Switcher Cards */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              เลือกห้องปฏิบัติการคอมพิวเตอร์ (Select Computer Lab)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rooms.map((rm) => (
                <button
                  key={rm.id}
                  onClick={() => {
                    setSelectedRoomId(rm.id);
                    setSelectedPcs([]);
                  }}
                  className={`p-4 rounded-2xl text-left border-2 transition-all relative overflow-hidden ${
                    selectedRoomId === rm.id
                      ? 'border-purple-600 bg-purple-50/60 shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-xs font-black rounded-lg">
                      {rm.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {rm.totalPcs} เครื่อง
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mt-2 line-clamp-1">
                    {rm.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {rm.building} • {rm.floor}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Workstation Floor Plan Area */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header & Status Legend */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">
                    ผังห้องปฏิบัติการ {currentRoom.code}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                    เปิดใช้งานปกติ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  คลิกเลือกเครื่องคอมพิวเตอร์เพื่อทำรายการจอง หรือคลิกแจ้งชำรุดกรณีอุปกรณ์ขัดข้อง
                </p>
              </div>

              {/* Status Color Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-2xs" />
                  <span className="text-slate-700">ว่าง (Green)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-md bg-red-500 shadow-2xs" />
                  <span className="text-slate-700">มีผู้ใช้งาน (Red)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-md bg-amber-400 shadow-2xs" />
                  <span className="text-slate-700">แจ้งชำรุด (Yellow)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-md bg-purple-600 shadow-2xs" />
                  <span className="text-slate-700">จองล่วงหน้า (Purple)</span>
                </div>
              </div>
            </div>

            {/* Room Grid Layout */}
            <div className="p-6 sm:p-8 bg-slate-100/60 min-h-[380px]">
              
              {/* Teacher Desk / Whiteboard Visual Marker */}
              <div className="max-w-md mx-auto mb-8 p-2.5 bg-slate-800 text-slate-200 text-xs font-bold text-center rounded-xl shadow-inner border border-slate-700 flex items-center justify-center gap-2">
                <Building className="w-4 h-4 text-orange-400" />
                <span>โต๊ะอาจารย์ผู้สอน & หน้าจอโปรเจกเตอร์ (TEACHER DESK & PROJECTOR SCREEN)</span>
              </div>

              {/* Workstations Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filteredComputers.map((comp) => {
                  const isSelected = selectedPcs.includes(comp.pcNumber);

                  const statusStyles = {
                    available: 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-400',
                    occupied: 'bg-red-50 border-red-200 text-red-900 opacity-90 cursor-not-allowed',
                    maintenance: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
                    reserved: 'bg-purple-50 border-purple-300 text-purple-900',
                  };

                  const badgeStyles = {
                    available: 'bg-emerald-500 text-white',
                    occupied: 'bg-red-500 text-white',
                    maintenance: 'bg-amber-500 text-slate-900',
                    reserved: 'bg-purple-600 text-white',
                  };

                  return (
                    <div
                      key={comp.id}
                      className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between h-28 ${
                        statusStyles[comp.status]
                      } ${isSelected ? 'ring-4 ring-purple-600 border-purple-600 bg-purple-100/80 shadow-md scale-102' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm">{comp.pcNumber}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${badgeStyles[comp.status]}`}>
                          {comp.status === 'available' && 'ว่าง'}
                          {comp.status === 'occupied' && 'ไม่ว่าง'}
                          {comp.status === 'maintenance' && 'ชำรุด'}
                          {comp.status === 'reserved' && 'จองแล้ว'}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 line-clamp-1 my-1">
                        {comp.specs}
                      </div>

                      {/* PC Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        {comp.status === 'available' && (
                          <button
                            onClick={() => togglePcSelection(comp.pcNumber)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-purple-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {isSelected ? 'เลือกแล้ว' : 'เลือกจอง'}
                          </button>
                        )}

                        <button
                          onClick={() => setReportingPc(comp)}
                          className="text-[10px] text-slate-500 hover:text-amber-700 font-medium underline ml-auto"
                        >
                          {comp.status === 'maintenance' ? 'ดูปัญหา' : 'แจ้งชำรุด'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Booking Action Bar when PCs are selected */}
              {selectedPcs.length > 0 && (
                <div className="sticky bottom-4 mt-6 max-w-xl mx-auto bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-purple-500/30 animate-in slide-in-from-bottom-4 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center">
                      {selectedPcs.length}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        เลือกเครื่อง: {selectedPcs.join(', ')}
                      </div>
                      <div className="text-[10px] text-purple-200">
                        ห้อง {currentRoom.code}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartBookingWithPcs}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <span>ไปที่หน้าฟอร์มการจอง</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKING FORM */}
      {activeTab === 'form' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-900 to-slate-900 text-white">
            <h2 className="text-lg font-black">ฟอร์มจองใช้งานห้องปฏิบัติการ / คอมพิวเตอร์</h2>
            <p className="text-xs text-purple-200 mt-0.5">
              ระบบกรอกคำขอจองห้องเรียนและเครื่องคอมพิวเตอร์ วิทยาลัยการอาชีพวาปีปทุม
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {formMsg && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-xs font-medium ${
                  formMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {formMsg.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{formMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* User Info Header Badge */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-purple-950">ผู้ขอจอง: {currentUser?.name}</div>
                  <div className="text-purple-700">รหัส: {currentUser?.code} • {currentUser?.department}</div>
                </div>
                <span className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg text-[11px]">
                  {currentUser?.level || 'นักศึกษา'}
                </span>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    วันที่ต้องการจอง (Booking Date) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().substring(0, 10)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                    required
                  />
                </div>

                {/* Time Slot Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ช่วงเวลาการใช้งาน (Time Slot) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  >
                    <option value="08:30-10:30">08:30 - 10:30 น. (เช้าช่วงแรก)</option>
                    <option value="10:30-12:30">10:30 - 12:30 น. (เช้าช่วงหลัง)</option>
                    <option value="13:00-15:00">13:00 - 15:00 น. (บ่ายช่วงแรก)</option>
                    <option value="15:00-17:00">15:00 - 17:00 น. (บ่ายช่วงหลัง)</option>
                  </select>
                </div>

              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ห้องปฏิบัติการ (Computer Room) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formRoomId}
                  onChange={(e) => setFormRoomId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                >
                  {rooms.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.code} - {rm.name} ({rm.totalPcs} เครื่อง)
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Room vs Specific PC toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    ประเภทการจอง (Booking Type)
                  </label>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="roomBookingType"
                        checked={!formIsFullRoom}
                        onChange={() => setFormIsFullRoom(false)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>จองระบุเครื่องคอมพิวเตอร์</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="roomBookingType"
                        checked={formIsFullRoom}
                        onChange={() => setFormIsFullRoom(true)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>จองทั้งห้องปฏิบัติการ</span>
                    </label>
                  </div>
                </div>

                {!formIsFullRoom && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      หมายเลขเครื่องคอมพิวเตอร์ที่ต้องการจอง:
                    </label>
                    <input
                      type="text"
                      value={formPcNumbers.join(', ')}
                      onChange={(e) =>
                        setFormPcNumbers(e.target.value.split(',').map((s) => s.trim()))
                      }
                      placeholder="เช่น PC-01, PC-02"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      คั่นด้วยเครื่องหมายจุลภาค (,) หากจองหลายเครื่องพร้อมกัน
                    </span>
                  </div>
                )}
              </div>

              {/* Purpose Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  วัตถุประสงค์ / เหตุผลการขอใช้งาน <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="เช่น ทำโครงงานพัฒนาระบบสารสนเทศ, ฝึกซ้อมนำเสนอผลงาน, ค้นคว้าข้อมูลวิชาโปรแกรมมิ่ง"
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ส่งคำขอจองห้องและคอมพิวเตอร์</span>
              </button>

            </form>
          </div>
        </div>
      )}

      {/* TAB 3: MY BOOKING HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                ประวัติรายการจองของฉัน (My Booking History)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ติดตามสถานะคำขอจอง พิมพ์ใบจอง หรือยกเลิกคำขอ
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-lg">
              รวม {myBookings.length} รายการ
            </span>
          </div>

          <div className="p-6">
            {myBookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Clock className="w-10 h-10 mx-auto text-slate-300" />
                <div className="text-sm font-bold text-slate-600">ยังไม่มีประวัติการจอง</div>
                <p className="text-xs">คุณสามารถเริ่มจองห้องหรือเครื่องคอมพิวเตอร์ได้ที่เมนู "ผังห้อง Real-time"</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myBookings.map((bk) => (
                  <div key={bk.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-purple-900">
                          {bk.bookingCode}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            bk.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : bk.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : bk.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {bk.status === 'approved' && '✓ อนุมัติแล้ว'}
                          {bk.status === 'pending' && '⏳ รอการอนุมัติ'}
                          {bk.status === 'rejected' && '✗ ปฏิเสธ'}
                          {bk.status === 'cancelled' && 'ยกเลิกแล้ว'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800">
                        {bk.roomName} • {bk.isFullRoom ? 'จองทั้งห้อง' : `เครื่อง ${bk.pcNumbers.join(', ')}`}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>วันที่: {bk.bookingDate}</span>
                        <span>•</span>
                        <span>เวลา: {bk.startTime} - {bk.endTime} น.</span>
                      </div>

                      <div className="text-[11px] text-slate-600 italic">
                        "{bk.purpose}"
                      </div>

                      {bk.adminNote && (
                        <div className="text-[11px] text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                          หมายเหตุผู้ดูแล: {bk.adminNote}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {bk.status === 'approved' && (
                        <button
                          onClick={() => setSelectedSlipBooking(bk)}
                          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>พิมพ์ใบจอง</span>
                        </button>
                      )}

                      {(bk.status === 'pending' || bk.status === 'approved') && (
                        <button
                          onClick={() => cancelBooking(bk.id)}
                          className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
                        >
                          ยกเลิกการจอง
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

      {/* TAB 4: APPS SCRIPT DETAIL IMPORTER (FIELD 2) */}
      {activeTab === 'details' && <AppsScriptDetailImporter />}

      {/* Print Slip Modal */}
      {selectedSlipBooking && (
        <BookingSlipModal
          booking={selectedSlipBooking}
          onClose={() => setSelectedSlipBooking(null)}
        />
      )}

      {/* Defect Report Modal */}
      {reportingPc && (
        <DefectReportModal
          computer={reportingPc}
          room={rooms.find((r) => r.id === reportingPc.roomId) || null}
          onClose={() => setReportingPc(null)}
        />
      )}

    </div>
  );
};
