'use client'; // เพื่อให้ทำงานใน client-side

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/solid'; // นำเข้าไอคอน

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
            <div className="flex flex-col items-center mb-8">
              <img src="/background.png" alt="Printing Exam System" className="w-20 h-20" />
              <h3 className="mt-4 text-center font-semibold">PRINTING EXAM SYSTEM</h3>
            </div>

            <div className="flex flex-col space-y-4">
              <button onClick={() => handleNavigation('/home')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                Home
              </button>
              <button onClick={() => handleNavigation('/home/subject-management')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                จัดการราชวิชา
              </button>
              <button onClick={() => handleNavigation('/home/user-management')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                จัดการผู้ใช้
              </button>
              <button onClick={() => handleNavigation('/home/exam-status')} className="w-32 h-12 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
                สถานะข้อสอบ
              </button>
            </div>
            <div className="mt-auto">
              <button className="w-32 h-12 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white">
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
