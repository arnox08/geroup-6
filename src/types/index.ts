export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  code: string; // รหัสประจำตัวนักศึกษา / รหัสบุคลากร (Institutional ID)
  name: string;
  role: UserRole;
  department: string;
  level?: string; // e.g. ปวส.1, ปวส.2, อาจารย์
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

export type PCStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface DefectReport {
  id: string;
  pcId: string;
  pcNumber: string;
  roomId: string;
  roomName: string;
  reportedBy: string;
  reporterCode: string;
  issueDescription: string;
  reportedAt: string;
  status: 'pending' | 'resolved';
}

export interface Computer {
  id: string;
  roomId: string;
  pcNumber: string; // e.g., "PC-01"
  status: PCStatus;
  specs: string;
  ipAddress?: string;
  activeUser?: string;
  defectReport?: DefectReport;
}

export interface Room {
  id: string;
  code: string; // e.g., "LAB-401"
  name: string;
  building: string;
  floor: string;
  capacity: number;
  totalPcs: number;
  description: string;
  status: 'available' | 'maintenance' | 'closed';
  managerName: string;
  softwareList: string[];
  imageUrl?: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "BK-20260723-001"
  userId: string;
  userCode: string;
  userName: string;
  userDepartment: string;
  userLevel?: string;
  roomId: string;
  roomName: string;
  pcNumbers: string[]; // empty means full room booking
  isFullRoom: boolean;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  status: BookingStatus;
  adminNote?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ClassSchedule {
  id: string;
  roomId: string;
  roomName: string;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ..., 5 = Friday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  studentGroup: string;
}
