import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Room, Computer, Booking, ClassSchedule, DefectReport, PCStatus, BookingStatus } from '../types';
import { INITIAL_USERS, INITIAL_ROOMS, generateInitialComputers, INITIAL_BOOKINGS, INITIAL_SCHEDULES } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  computers: Computer[];
  bookings: Booking[];
  schedules: ClassSchedule[];
  defectReports: DefectReport[];
  
  googleSheetsUrl: string;
  appsScriptUrl: string;
  setAppsScriptUrl: (url: string) => void;
  syncUserToGoogleSheet: (userPayload: any) => Promise<{ success: boolean; error?: string; localOnly?: boolean }>;
  fetchUsersFromGoogleSheet: () => Promise<{ success: boolean; count: number; error?: string }>;
  importedDetails: Array<{ id: string; title: string; category: string; content: string; createdAt: string; syncedToSheet: boolean }>;
  importDetailDataToAppsScript: (detailPayload: { title: string; category: string; content: string; note?: string }) => Promise<{ success: boolean; error?: string }>;

  login: (code: string, password?: string) => { success: boolean; message: string; role?: string };
  logout: () => void;
  switchUserDemo: (userId: string) => void;
  
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status'>) => { success: boolean; message: string; booking?: Booking };
  cancelBooking: (bookingId: string) => void;
  approveBooking: (bookingId: string, adminNote?: string) => void;
  rejectBooking: (bookingId: string, adminNote: string) => void;
  
  addScheduleLock: (schedule: Omit<ClassSchedule, 'id'>) => void;
  deleteScheduleLock: (scheduleId: string) => void;
  
  updatePcStatus: (pcId: string, status: PCStatus) => void;
  reportPcIssue: (pcId: string, issueDescription: string) => void;
  resolveDefect: (reportId: string) => void;
  
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;

  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or stored state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dbt_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged in as Student for instant viewing
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('dbt_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('dbt_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [computers, setComputers] = useState<Computer[]>(() => {
    const saved = localStorage.getItem('dbt_computers');
    return saved ? JSON.parse(saved) : generateInitialComputers();
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('dbt_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem('dbt_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const defectReports = computers
    .filter((c) => c.defectReport)
    .map((c) => c.defectReport!);

  // Save to localStorage when state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dbt_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dbt_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dbt_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dbt_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('dbt_computers', JSON.stringify(computers));
  }, [computers]);

  useEffect(() => {
    localStorage.setItem('dbt_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('dbt_schedules', JSON.stringify(schedules));
  }, [schedules]);

  const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/1Qrvn_Xm5uwuLSSFhTcMj88r3UwS7sXOgbj3xlCqULbc/edit?usp=sharing';

  const [appsScriptUrl, setAppsScriptUrlState] = useState<string>(() => {
    return localStorage.getItem('dbt_apps_script_url') || '';
  });

  const [importedDetails, setImportedDetails] = useState<
    Array<{ id: string; title: string; category: string; content: string; createdAt: string; syncedToSheet: boolean }>
  >(() => {
    const saved = localStorage.getItem('dbt_imported_details');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'dt-1',
            title: 'คู่มือการใช้งานห้องคอมพิวเตอร์ 401',
            category: 'ระเบียบการใช้งาน',
            content: 'ห้ามนำอาหารและเครื่องดื่มเข้าห้องปฏิบัติการคอมพิวเตอร์ และกรุณาปิดเครื่องคอมพิวเตอร์หลังใช้งานเสร็จสิ้นทุกครั้ง',
            createdAt: new Date().toLocaleDateString('th-TH'),
            syncedToSheet: true,
          },
          {
            id: 'dt-2',
            title: 'ตารางบำรุงรักษาเครื่องคอมพิวเตอร์ประจำเดือน',
            category: 'บำรุงรักษา',
            content: 'อัปเดตระบบปฏิบัติการ Windows และสแกนไวรัสเครื่อง PC-01 ถึง PC-30 ประจำทุกวันศุกร์สัปดาห์แรกของเดือน',
            createdAt: new Date().toLocaleDateString('th-TH'),
            syncedToSheet: true,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('dbt_imported_details', JSON.stringify(importedDetails));
  }, [importedDetails]);

  const setAppsScriptUrl = (url: string) => {
    setAppsScriptUrlState(url);
    localStorage.setItem('dbt_apps_script_url', url);
  };

  const syncUserToGoogleSheet = async (userPayload: any) => {
    try {
      if (!appsScriptUrl) {
        console.info('Apps Script Web App URL is not set yet. User saved in application memory.');
        return { success: true, localOnly: true };
      }

      const formData = new URLSearchParams();
      formData.append('code', userPayload.code || '');
      formData.append('name', userPayload.name || '');
      formData.append('role', userPayload.role || 'student');
      formData.append('department', userPayload.department || '');
      formData.append('level', userPayload.level || '');
      formData.append('email', userPayload.email || '');
      formData.append('phone', userPayload.phone || '');
      formData.append('password', userPayload.password || '');
      formData.append('timestamp', new Date().toLocaleString('th-TH'));

      await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      return { success: true };
    } catch (err: any) {
      console.error('Failed to post to Apps Script:', err);
      return { success: false, error: err?.message || 'Sync error' };
    }
  };

  const fetchUsersFromGoogleSheet = async () => {
    try {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/1Qrvn_Xm5uwuLSSFhTcMj88r3UwS7sXOgbj3xlCqULbc/gviz/tq?tqx=out:csv';
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลจาก Google Sheet ได้');
      }
      const csvText = await response.text();
      
      const lines = csvText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      if (lines.length <= 1) {
        return { success: true, count: 0 };
      }

      const fetchedUsers: User[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 2) {
          const code = cols[1] || `USER-${i}`;
          const name = cols[2] || cols[1] || `ผู้ใช้ ${i}`;
          const roleStr = cols[3] || '';
          const role: 'student' | 'admin' = roleStr.includes('ผู้ดูแล') || roleStr.includes('admin') ? 'admin' : 'student';
          const department = cols[4] || 'เทคโนโลยีธุรกิจดิจิทัล';
          const level = cols[5] || 'ปวส.1/1';
          const email = cols[6] || `${code.toLowerCase()}@wptc.ac.th`;
          const phone = cols[7] || '080-000-0000';

          if (code && code.toUpperCase() !== 'รหัสประจำตัว') {
            fetchedUsers.push({
              id: `sheet-usr-${i}-${code}`,
              code: code.toUpperCase(),
              name,
              role,
              department,
              level,
              email,
              phone,
              avatar: role === 'admin'
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            });
          }
        }
      }

      if (fetchedUsers.length > 0) {
        setUsers((prev) => {
          const existingCodes = new Set(prev.map((u) => u.code.toUpperCase()));
          const newUsers = fetchedUsers.filter((u) => !existingCodes.has(u.code.toUpperCase()));
          const updated = [...prev, ...newUsers];
          localStorage.setItem('dbt_users', JSON.stringify(updated));
          return updated;
        });
        return { success: true, count: fetchedUsers.length };
      }

      return { success: true, count: 0 };
    } catch (err: any) {
      console.warn('CSV fetch notice:', err);
      return { success: false, count: 0, error: err?.message || 'ไม่สามารถโหลดจาก Google Sheet ได้โดยตรง' };
    }
  };

  const importDetailDataToAppsScript = async (detailPayload: {
    title: string;
    category: string;
    content: string;
    note?: string;
  }) => {
    const newDetail = {
      id: `dt-${Date.now()}`,
      title: detailPayload.title,
      category: detailPayload.category,
      content: detailPayload.content,
      createdAt: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      syncedToSheet: false,
    };

    setImportedDetails((prev) => [newDetail, ...prev]);

    if (!appsScriptUrl) {
      return { success: true };
    }

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'import_detail');
      formData.append('title', detailPayload.title);
      formData.append('category', detailPayload.category);
      formData.append('content', detailPayload.content);
      formData.append('note', detailPayload.note || '');
      formData.append('timestamp', new Date().toLocaleString('th-TH'));

      await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      setImportedDetails((prev) =>
        prev.map((item) => (item.id === newDetail.id ? { ...item, syncedToSheet: true } : item))
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'เกิดข้อผิดพลาดในการส่งเข้า Apps Script' };
    }
  };

  // Auth Methods
  const login = (code: string, password?: string) => {
    const cleanCode = code.trim().toUpperCase();
    const user = users.find((u) => u.code.toUpperCase() === cleanCode);

    if (!user) {
      return { success: false, message: 'ไม่พบรหัสผู้ใช้งานในระบบ (กรุณาตรวจสอบรหัสสถาบัน หรือสมัครสมาชิกใหม่)' };
    }

    // Explicit check for admin credentials ID=admin, password=11223344
    if (cleanCode === 'ADMIN' || user.role === 'admin') {
      if (password && password !== '11223344' && password !== 'admin123' && password !== 'password') {
        return { success: false, message: 'รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง (ใช้ ID: admin / Password: 11223344)' };
      }
    }

    setCurrentUser(user);
    return {
      success: true,
      message: `ยินดีต้อนรับ ${user.name} (${user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักศึกษา'})`,
      role: user.role,
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserDemo = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Booking Methods
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status'>) => {
    // Validate class schedule lock
    const bookingDateObj = new Date(bookingData.bookingDate);
    const dayOfWeek = bookingDateObj.getDay(); // 0 = Sun, 1 = Mon ...
    
    // Check locked schedule
    const lockedSlot = schedules.find(
      (s) =>
        s.roomId === bookingData.roomId &&
        s.dayOfWeek === dayOfWeek &&
        ((bookingData.startTime >= s.startTime && bookingData.startTime < s.endTime) ||
          (bookingData.endTime > s.startTime && bookingData.endTime <= s.endTime))
    );

    if (lockedSlot) {
      return {
        success: false,
        message: `ไม่สามารถจองได้: ช่วงเวลานี้ติดตารางเรียนวิชา "${lockedSlot.subjectName}" (${lockedSlot.teacherName})`,
      };
    }

    // Check existing approved bookings
    const duplicateApproved = bookings.find(
      (b) =>
        b.roomId === bookingData.roomId &&
        b.bookingDate === bookingData.bookingDate &&
        b.status === 'approved' &&
        ((bookingData.startTime >= b.startTime && bookingData.startTime < b.endTime) ||
          (bookingData.endTime > b.startTime && bookingData.endTime <= b.endTime)) &&
        (b.isFullRoom || bookingData.isFullRoom || b.pcNumbers.some((pc) => bookingData.pcNumbers.includes(pc)))
    );

    if (duplicateApproved) {
      return {
        success: false,
        message: `ไม่สามารถจองได้: เครื่องหรือห้องนี้มีการจองซ้ำในเวลาดังกล่าว (${duplicateApproved.bookingCode})`,
      };
    }

    const newId = `bk-${Date.now()}`;
    const dateStr = bookingData.bookingDate.replace(/-/g, '');
    const randNum = Math.floor(100 + Math.random() * 900);
    const bookingCode = `BK-${dateStr}-${randNum}`;

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      bookingCode,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setBookings((prev) => [newBooking, ...prev]);

    return {
      success: true,
      message: `ส่งคำขอจองเรียบร้อยแล้ว! รหัสใบจอง: ${bookingCode} (รอการอนุมัติจากอาจารย์ผู้ดูแล)`,
      booking: newBooking,
    };
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b))
    );
  };

  const approveBooking = (bookingId: string, adminNote?: string) => {
    const bookingToApprove = bookings.find((b) => b.id === bookingId);
    if (!bookingToApprove) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'approved' as BookingStatus,
              adminNote: adminNote || 'อนุมัติเรียบร้อยแล้ว',
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              approvedBy: currentUser?.name || 'แอดมิน',
            }
          : b
      )
    );

    // Update PC status if booking is for today
    const today = new Date().toISOString().substring(0, 10);
    if (bookingToApprove.bookingDate === today && !bookingToApprove.isFullRoom) {
      setComputers((prev) =>
        prev.map((pc) => {
          if (pc.roomId === bookingToApprove.roomId && bookingToApprove.pcNumbers.includes(pc.pcNumber)) {
            return { ...pc, status: 'reserved' as PCStatus };
          }
          return pc;
        })
      );
    }
  };

  const rejectBooking = (bookingId: string, adminNote: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'rejected' as BookingStatus,
              adminNote: adminNote || 'ไม่สามารถอนุมัติได้',
            }
          : b
      )
    );
  };

  // Class Schedule Lock
  const addScheduleLock = (scheduleData: Omit<ClassSchedule, 'id'>) => {
    const newSchedule: ClassSchedule = {
      ...scheduleData,
      id: `sch-${Date.now()}`,
    };
    setSchedules((prev) => [...prev, newSchedule]);
  };

  const deleteScheduleLock = (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  // PC & Room Management
  const updatePcStatus = (pcId: string, status: PCStatus) => {
    setComputers((prev) =>
      prev.map((pc) => (pc.id === pcId ? { ...pc, status } : pc))
    );
  };

  const reportPcIssue = (pcId: string, issueDescription: string) => {
    setComputers((prev) =>
      prev.map((pc) => {
        if (pc.id === pcId) {
          const room = rooms.find((r) => r.id === pc.roomId);
          const newReport: DefectReport = {
            id: `def-${Date.now()}`,
            pcId,
            pcNumber: pc.pcNumber,
            roomId: pc.roomId,
            roomName: room?.code || pc.roomId,
            reportedBy: currentUser?.name || 'ไม่ระบุชื่อ',
            reporterCode: currentUser?.code || '-',
            issueDescription,
            reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'pending',
          };
          return {
            ...pc,
            status: 'maintenance' as PCStatus,
            defectReport: newReport,
          };
        }
        return pc;
      })
    );
  };

  const resolveDefect = (reportId: string) => {
    setComputers((prev) =>
      prev.map((pc) => {
        if (pc.defectReport && pc.defectReport.id === reportId) {
          return {
            ...pc,
            status: 'available' as PCStatus,
            defectReport: undefined,
          };
        }
        return pc;
      })
    );
  };

  // User Management
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Room Management
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoomId = `rm-${Date.now()}`;
    const newRoom: Room = {
      ...roomData,
      id: newRoomId,
    };
    setRooms((prev) => [...prev, newRoom]);

    // Automatically generate computers for new room
    const newComputers: Computer[] = [];
    for (let i = 1; i <= roomData.totalPcs; i++) {
      const pcNum = `PC-${i.toString().padStart(2, '0')}`;
      newComputers.push({
        id: `comp-${newRoomId}-${pcNum}`,
        roomId: newRoomId,
        pcNumber: pcNum,
        status: 'available',
        specs: 'Intel Core i5 / RAM 16GB / SSD 512GB',
      });
    }
    setComputers((prev) => [...prev, ...newComputers]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms((prev) => prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)));
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    setComputers((prev) => prev.filter((c) => c.roomId !== roomId));
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setRooms(INITIAL_ROOMS);
    setComputers(generateInitialComputers());
    setBookings(INITIAL_BOOKINGS);
    setSchedules(INITIAL_SCHEDULES);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
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
        fetchUsersFromGoogleSheet,
        importedDetails,
        importDetailDataToAppsScript,
        login,
        logout,
        switchUserDemo,
        createBooking,
        cancelBooking,
        approveBooking,
        rejectBooking,
        addScheduleLock,
        deleteScheduleLock,
        updatePcStatus,
        reportPcIssue,
        resolveDefect,
        addUser,
        updateUser,
        deleteUser,
        addRoom,
        updateRoom,
        deleteRoom,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
