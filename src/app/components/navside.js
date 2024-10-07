'use client'; // เพื่อให้ทำงานใน client-side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/solid'; // นำเข้าไอคอน
import { supabase } from '@/lib/supabase'; // นำเข้า Supabase Client

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(true); // สถานะเปิด-ปิด
  const router = useRouter(); // ใช้งาน useRouter

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // สลับสถานะ
  };

  // ฟังก์ชันสำหรับการนำทาง
  const handleNavigation = (path) => {
    if (router.pathname !== path) { // ตรวจสอบว่า URL ปัจจุบันไม่ตรงกับ path
      router.push(path); // นำทางไปยัง path ที่ระบุ
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = async () => {
    const { error } = await supabase.auth.signOut(); // เรียกใช้ signOut ของ Supabase
    if (error) {
      console.error('Error signing out:', error.message); // แสดงข้อความผิดพลาด
    } else {
      router.push('/login'); // นำทางไปยังหน้า login หลังออกจากระบบ
    }
  };

  return (
    <div className={`flex ${isOpen ? 'w-56' : 'w-16'} h-screen bg-gray-300 transition-width duration-300 relative`}>
      {/* ปุ่มเปิด-ปิด */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 left-4 p-2 rounded-full bg-gray-400 hover:bg-gray-500 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
      >
        {isOpen ? <ChevronLeftIcon className="w-6 h-6 text-white" /> : <ChevronRightIcon className="w-6 h-6 text-white" />}
      </button>

      <div className={`flex flex-col justify-between items-center h-full py-8`}>
        {/* ส่วนที่แสดงเมื่อเปิด */}
        {isOpen && (
          <>
            <div className="flex flex-col items-center mb-8 w-full"> {/* เพิ่ม w-full ที่นี่ */}
            <img src="/images/background.png" alt="Logo" className="w-full h-28 object-cover" />

            <h3 className="mt-2 text-center font-semibold text-xl">
                      <span style={{ color: 'Red' }}>PRINTING</span> EXAM SYSTEM
            </h3>
            </div>

            <div className="flex flex-col space-y-4">
                  <button onClick={() => handleNavigation('/home')} className="w-32 h-1npm 2 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    Home
                  </button>
                  <button onClick={() => handleNavigation('/home/subject-management')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    จัดการรายวิชา
                  </button>
                  <button onClick={() => handleNavigation('/home/user-management')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    จัดการผู้ใช้
                  </button>
                  
                  <button onClick={() => handleNavigation('/home/exam-management')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    จัดการข้อสอบ
                  </button>
                  <button onClick={() => handleNavigation('/home/exam-status')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    สถานะข้อสอบ
                  </button>
                  <button onClick={() => handleNavigation('/home/examup')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    อัปโหลดข้อสอบ
                  </button>
                  <button onClick={() => handleNavigation('/home/examdown')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                    ดาวน์โหลดข้อสอบ
                  </button>
                 
            </div>
            <div className="mt-auto">
              <button
                onClick={logout} // เรียกใช้ฟังก์ชัน logout
                className="w-32 h-12 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
              >
                LogOut
              </button>
            </div>
          </>
        )}
      </div>

      {/* ไอคอนเมื่อ sidebar ปิด */}
      {!isOpen && (
        <div className="absolute top-4 left-4 p-2">
          <button
            onClick={toggleSidebar}
            className="rounded-full bg-gray-400 hover:bg-gray-500"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
