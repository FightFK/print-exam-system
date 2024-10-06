'use client'; // เพื่อให้ทำงานใน client-side

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // นำเข้าสูปาเบสจากไฟล์ที่คุณกำหนดไว้

export default function Page() {
  const [email, setEmail] = useState(null); // สร้าง state สำหรับเก็บอีเมล

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // ดึงข้อมูล session
      if (session) {
        setEmail(session.user.email); // ถ้ามี session, เซ็ตอีเมลใน state
      }
    };

    fetchUserEmail();
  }, []); // เรียกใช้เมื่อคอมโพเนนต์ถูก mount

  return (
    <div className="flex flex-col h-full"> {/* ใช้ flex-col เพื่อให้พื้นที่เต็มความสูง */}
      {/* เนื้อหาของหน้าโฮม */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Home Page!</h1>
        {email ? ( // แสดงอีเมลถ้ามี
          <p className="mt-4 text-gray-600">
            Your email: <span className="font-semibold">{email}</span>
          </p>
        ) : (
          <p className="mt-4 text-gray-600">Loading email...</p> // ข้อความโหลดถ้ายังไม่ได้ข้อมูล
        )}
        <p className="mt-4 text-gray-600">
          This is the main content area where you can add more details about your application.
        </p>
      </div>
    </div>
  );
}
