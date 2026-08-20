import { User, Room, Computer, Booking, ClassSchedule, DefectReport } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    code: 'STD6601',
    name: 'นายสมชาย ใจดี',
    role: 'student',
    department: 'เทคโนโลยีธุรกิจดิจิทัล',
    level: 'ปวส.1/1',
    email: 'somchai.j@wptc.ac.th',
    phone: '081-234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-05-15',
  },
  {
    id: 'usr-2',
    code: 'STD6602',
    name: 'นางสาวสุดารัตน์ มีสุข',
    role: 'student',
    department: 'เทคโนโลยีธุรกิจดิจิทัล',
    level: 'ปวส.2/1',
    email: 'sudarat.m@wptc.ac.th',
    phone: '089-876-5432',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-05-16',
  },
  {
    id: 'usr-3',
    code: 'STD6603',
    name: 'นายกิตติศักดิ์ ชัยชนะ',
    role: 'student',
    department: 'เทคโนโลยีธุรกิจดิจิทัล',
    level: 'ปวช.3/2',
    email: 'kittisak.c@wptc.ac.th',
    phone: '082-111-2233',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-05-20',
  },
  {
    id: 'usr-admin-1',
    code: 'ADMIN',
    name: 'ดร.วิชัย สอนดี (ครูผู้ดูแลระบบ)',
    role: 'admin',
    department: 'เทคโนโลยีธุรกิจดิจิทัล',
    level: 'อาจารย์ประจำสาขา',
    email: 'wichai.s@wptc.ac.th',
    phone: '086-999-8877',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-admin-2',
    code: 'ADM002',
    name: 'อ.พรทิพย์ ศรีสว่าง',
    role: 'admin',
    department: 'เทคโนโลยีสารสนเทศ',
    level: 'อาจารย์ประจำสาขา',
    email: 'porntip.s@wptc.ac.th',
    phone: '084-555-6677',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01',
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'rm-401',
    code: 'LAB-401',
    name: 'ห้องปฏิบัติการคอมพิวเตอร์ 1 (DBT Smart Lab 1)',
    building: 'อาคารวิทยบริการและสารสนเทศ',
    floor: 'ชั้น 4',
    capacity: 35,
    totalPcs: 30,
    description: 'ห้องปฏิบัติการคอมพิวเตอร์สมรรถนะสูง สำหรับวิชาการเขียนโปรแกรมและการพัฒนาเว็บ',
    status: 'available',
    managerName: 'ดร.วิชัย สอนดี',
    softwareList: ['VS Code', 'Node.js', 'Python 3.12', 'XAMPP', 'Adobe Creative Cloud', 'Figma'],
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rm-402',
    code: 'LAB-402',
    name: 'ห้องปฏิบัติการสื่อดิจิทัลและแอนิเมชัน (Media Design Lab)',
    building: 'อาคารวิทยบริการและสารสนเทศ',
    floor: 'ชั้น 4',
    capacity: 30,
    totalPcs: 25,
    description: 'ห้องประมวลผลกราฟิก ตัดต่อวิดีโอ งานออกแบบสื่อดิจิทัลและการตลาดออนไลน์',
    status: 'available',
    managerName: 'อ.พรทิพย์ ศรีสว่าง',
    softwareList: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Blender', 'Canva Desktop'],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rm-403',
    code: 'LAB-403',
    name: 'ห้องปฏิบัติการเครือข่ายและระบบไอโอที (Network & IoT Lab)',
    building: 'อาคารปฏิบัติการเทคโนโลยี',
    floor: 'ชั้น 3',
    capacity: 28,
    totalPcs: 24,
    description: 'ห้องฝึกปฏิบัติการจำลองเครือข่าย Cisco, ระบบคลาวด์ และอุปกรณ์ IoT เซนเซอร์',
    status: 'available',
    managerName: 'อ.วิชัย สอนดี',
    softwareList: ['Cisco Packet Tracer', 'Wireshark', 'VirtualBox', 'Docker', 'Arduino IDE'],
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rm-404',
    code: 'CONF-404',
    name: 'ห้องบรรยายและสัมมนาเทคโนโลยีธุรกิจดิจิทัล (DBT Seminar Room)',
    building: 'อาคารวิทยบริการและสารสนเทศ',
    floor: 'ชั้น 4',
    capacity: 50,
    totalPcs: 10,
    description: 'ห้องสัมมนาพร้อมโปรเจกเตอร์ความละเอียดสูงและระบบเสียง สำหรับการนำเสนอโครงงาน',
    status: 'available',
    managerName: 'ดร.วิชัย สอนดี',
    softwareList: ['Microsoft Office 365', 'OBS Studio', 'Zoom Desktop'],
    imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&auto=format&fit=crop&q=80',
  }
];

export function generateInitialComputers(): Computer[] {
  const computers: Computer[] = [];

  // Room LAB-401 (30 PCs)
  for (let i = 1; i <= 30; i++) {
    const pcNum = `PC-${i.toString().padStart(2, '0')}`;
    let status: 'available' | 'occupied' | 'maintenance' | 'reserved' = 'available';
    let issueReport = undefined;

    if (i === 5) {
      status = 'occupied';
    } else if (i === 12) {
      status = 'maintenance';
      issueReport = {
        id: 'def-101',
        pcId: `comp-rm-401-${pcNum}`,
        pcNumber: pcNum,
        roomId: 'rm-401',
        roomName: 'LAB-401',
        reportedBy: 'นายสมชาย ใจดี',
        reporterCode: 'STD6601',
        issueDescription: 'หน้าจอดับเองระหว่างใช้งาน คาดว่าสาย HDMI หลวมหรือการ์ดจอมีปัญหา',
        reportedAt: '2026-07-22 14:30',
        status: 'pending' as const,
      };
    } else if (i === 18) {
      status = 'reserved';
    } else if (i === 22) {
      status = 'occupied';
    }

    computers.push({
      id: `comp-rm-401-${pcNum}`,
      roomId: 'rm-401',
      pcNumber: pcNum,
      status,
      specs: 'Intel Core i7 Gen 13 / RAM 16GB / SSD 512GB / RTX 3060 / Monitor 24" 165Hz',
      ipAddress: `192.168.4.1${i.toString().padStart(2, '0')}`,
      activeUser: status === 'occupied' ? 'นักศึกษาใช้ปฏิบัติงาน' : undefined,
      defectReport: issueReport,
    });
  }

  // Room LAB-402 (25 PCs)
  for (let i = 1; i <= 25; i++) {
    const pcNum = `PC-${i.toString().padStart(2, '0')}`;
    let status: 'available' | 'occupied' | 'maintenance' | 'reserved' = 'available';
    let issueReport = undefined;

    if (i === 3 || i === 4) {
      status = 'occupied';
    } else if (i === 8) {
      status = 'maintenance';
      issueReport = {
        id: 'def-102',
        pcId: `comp-rm-402-${pcNum}`,
        pcNumber: pcNum,
        roomId: 'rm-402',
        roomName: 'LAB-402',
        reportedBy: 'นางสาวสุดารัตน์ มีสุข',
        reporterCode: 'STD6602',
        issueDescription: 'เมาส์คลิกซ้ายไม่ติดและปากกาวาดรูปดิจิทัลตอบสนองช้า',
        reportedAt: '2026-07-21 10:15',
        status: 'pending' as const,
      };
    }

    computers.push({
      id: `comp-rm-402-${pcNum}`,
      roomId: 'rm-402',
      pcNumber: pcNum,
      status,
      specs: 'Apple Mac Mini M2 / RAM 16GB / SSD 512GB / Monitor 27" 4K IPS Design',
      ipAddress: `192.168.4.2${i.toString().padStart(2, '0')}`,
      defectReport: issueReport,
    });
  }

  // Room LAB-403 (24 PCs)
  for (let i = 1; i <= 24; i++) {
    const pcNum = `PC-${i.toString().padStart(2, '0')}`;
    computers.push({
      id: `comp-rm-403-${pcNum}`,
      roomId: 'rm-403',
      pcNumber: pcNum,
      status: i === 15 ? 'maintenance' : 'available',
      specs: 'Intel Core i5 Gen 12 / RAM 16GB / SSD 512GB / Dual NIC Gigabit',
      ipAddress: `192.168.3.1${i.toString().padStart(2, '0')}`,
    });
  }

  // Room CONF-404 (10 PCs)
  for (let i = 1; i <= 10; i++) {
    const pcNum = `PC-${i.toString().padStart(2, '0')}`;
    computers.push({
      id: `comp-rm-404-${pcNum}`,
      roomId: 'rm-404',
      pcNumber: pcNum,
      status: 'available',
      specs: 'Notebook Asus Vivobook Pro 15 / Ryzen 7 / 16GB RAM',
      ipAddress: `192.168.1.1${i.toString().padStart(2, '0')}`,
    });
  }

  return computers;
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    bookingCode: 'BK-20260723-001',
    userId: 'usr-1',
    userCode: 'STD6601',
    userName: 'นายสมชาย ใจดี',
    userDepartment: 'เทคโนโลยีธุรกิจดิจิทัล',
    userLevel: 'ปวส.1/1',
    roomId: 'rm-401',
    roomName: 'LAB-401 (Smart Lab 1)',
    pcNumbers: ['PC-01', 'PC-02'],
    isFullRoom: false,
    bookingDate: '2026-07-23',
    startTime: '13:00',
    endTime: '15:00',
    purpose: 'ฝึกซ้อมทำโครงงานแอปพลิเคชันระบบสารสนเทศเพื่อการจัดการ',
    status: 'approved',
    createdAt: '2026-07-22 09:30',
    approvedAt: '2026-07-22 11:00',
    approvedBy: 'ดร.วิชัย สอนดี',
  },
  {
    id: 'bk-002',
    bookingCode: 'BK-20260723-002',
    userId: 'usr-2',
    userCode: 'STD6602',
    userName: 'นางสาวสุดารัตน์ มีสุข',
    userDepartment: 'เทคโนโลยีธุรกิจดิจิทัล',
    userLevel: 'ปวส.2/1',
    roomId: 'rm-402',
    roomName: 'LAB-402 (Media Design Lab)',
    pcNumbers: ['PC-05'],
    isFullRoom: false,
    bookingDate: '2026-07-23',
    startTime: '15:00',
    endTime: '17:00',
    purpose: 'ตัดต่อวิดีโอพรีเซนเทชันการประกวดนวัตกรรมดิจิทัล',
    status: 'pending',
    createdAt: '2026-07-23 08:15',
  },
  {
    id: 'bk-003',
    bookingCode: 'BK-20260724-003',
    userId: 'usr-3',
    userCode: 'STD6603',
    userName: 'นายกิตติศักดิ์ ชัยชนะ',
    userDepartment: 'เทคโนโลยีธุรกิจดิจิทัล',
    userLevel: 'ปวช.3/2',
    roomId: 'rm-404',
    roomName: 'CONF-404 (DBT Seminar Room)',
    pcNumbers: [],
    isFullRoom: true,
    bookingDate: '2026-07-24',
    startTime: '09:00',
    endTime: '12:00',
    purpose: 'จัดกิจกรรมติวเข้มทักษะการออกแบบเรซูเม่และ Portfolio ออนไลน์',
    status: 'pending',
    createdAt: '2026-07-23 09:00',
  },
  {
    id: 'bk-004',
    bookingCode: 'BK-20260720-004',
    userId: 'usr-1',
    userCode: 'STD6601',
    userName: 'นายสมชาย ใจดี',
    userDepartment: 'เทคโนโลยีธุรกิจดิจิทัล',
    userLevel: 'ปวส.1/1',
    roomId: 'rm-403',
    roomName: 'LAB-403 (Network & IoT Lab)',
    pcNumbers: ['PC-10'],
    isFullRoom: false,
    bookingDate: '2026-07-20',
    startTime: '10:30',
    endTime: '12:30',
    purpose: 'ทดสอบการส่งค่าจากบอร์ด ESP32 เข้าสู่เซิร์ฟเวอร์ MQTT',
    status: 'approved',
    createdAt: '2026-07-19 14:00',
    approvedAt: '2026-07-19 16:30',
    approvedBy: 'อ.พรทิพย์ ศรีสว่าง',
  },
  {
    id: 'bk-005',
    bookingCode: 'BK-20260718-005',
    userId: 'usr-2',
    userCode: 'STD6602',
    userName: 'นางสาวสุดารัตน์ มีสุข',
    userDepartment: 'เทคโนโลยีธุรกิจดิจิทัล',
    userLevel: 'ปวส.2/1',
    roomId: 'rm-401',
    roomName: 'LAB-401 (Smart Lab 1)',
    pcNumbers: ['PC-15'],
    isFullRoom: false,
    bookingDate: '2026-07-18',
    startTime: '13:00',
    endTime: '15:00',
    purpose: 'ค้นคว้าบทความวิจัยเกี่ยวกับการตลาดผ่านโซเชียลมีเดีย',
    status: 'rejected',
    adminNote: 'ห้องติดตารางสอนวิชาการพัฒนาเว็บในเวลานี้',
    createdAt: '2026-07-17 11:20',
  }
];

export const INITIAL_SCHEDULES: ClassSchedule[] = [
  {
    id: 'sch-1',
    roomId: 'rm-401',
    roomName: 'LAB-401',
    dayOfWeek: 1, // Mon
    startTime: '08:30',
    endTime: '12:30',
    subjectCode: '30204-2001',
    subjectName: 'การพัฒนาเว็บแอปพลิเคชันด้วยฟรอนต์เอนด์',
    teacherName: 'ดร.วิชัย สอนดี',
    studentGroup: 'ปวส.1/1 เทคโนโลยีธุรกิจดิจิทัล',
  },
  {
    id: 'sch-2',
    roomId: 'rm-401',
    roomName: 'LAB-401',
    dayOfWeek: 3, // Wed
    startTime: '13:00',
    endTime: '17:00',
    subjectCode: '30204-2102',
    subjectName: 'การวิเคราะห์และออกแบบระบบสารสนเทศ',
    teacherName: 'ดร.วิชัย สอนดี',
    studentGroup: 'ปวส.2/1 เทคโนโลยีธุรกิจดิจิทัล',
  },
  {
    id: 'sch-3',
    roomId: 'rm-402',
    roomName: 'LAB-402',
    dayOfWeek: 2, // Tue
    startTime: '08:30',
    endTime: '12:30',
    subjectCode: '30204-2005',
    subjectName: 'การออกแบบมัลติมีเดียและแอนิเมชัน',
    teacherName: 'อ.พรทิพย์ ศรีสว่าง',
    studentGroup: 'ปวส.1/2 เทคโนโลยีธุรกิจดิจิทัล',
  },
  {
    id: 'sch-4',
    roomId: 'rm-403',
    roomName: 'LAB-403',
    dayOfWeek: 4, // Thu
    startTime: '13:00',
    endTime: '17:00',
    subjectCode: '30204-2108',
    subjectName: 'การเชื่อมต่อระบบคลาวด์และ IoT ในธุรกิจ',
    teacherName: 'ดร.วิชัย สอนดี',
    studentGroup: 'ปวส.2/1 เทคโนโลยีธุรกิจดิจิทัล',
  }
];
