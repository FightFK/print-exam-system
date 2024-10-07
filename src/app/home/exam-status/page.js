"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // นำเข้า supabase client

export default function Page() {
  const [statuses, setStatuses] = useState([]);

  // ฟังก์ชันเพื่อดึงข้อมูลสถานะจากฐานข้อมูลพร้อมกับข้อมูลที่เกี่ยวข้อง
  const fetchStatuses = async () => {
    const { data, error } = await supabase
      .from('status')
      .select(`
        *,
        subjects:Subid (Subid, Subname), 
        exams:examid (examid)
      `);

    if (error) {
      console.error('Error fetching statuses:', error);
    } else {
      // เรียงข้อมูลตาม Subid จากน้อยไปมาก
      const sortedData = data.sort((a, b) => Number(a.Subid) - Number(b.Subid));
      setStatuses(sortedData);
      console.log('Fetched statuses:', sortedData);
    }
  };

  const updateStatus = async (subid, newStatus) => {
    const { error } = await supabase
      .from('status') // ชื่อ table ที่ต้องการอัปเดต
      .update({ status: newStatus }) // กำหนดค่าที่ต้องการอัปเดต
      .eq('Subid', subid); // ใช้ 'subid' ให้ตรงกับฐานข้อมูล

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchStatuses(); // เรียกใช้ฟังก์ชันดึงข้อมูลอีกครั้งเพื่ออัปเดตสถานะในตาราง
    }
  };

  useEffect(() => {
    fetchStatuses(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component โหลด
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-200">
      {/* แทบค้นหา */}
      <div className="p-7 bg-pink-500 flex items-center">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 4a8 8 0 100 16 8 8 0 000-16z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35"
            />
          </svg>
          <input
            type="text"
            placeholder="รหัสวิชา"
            className="pl-20 pr-20 py-2 bg-white rounded-full focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* ตาราง */}
      <div className="flex-1 p-6 overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-pink-500 text-white">
              <th className="px-4 py-2">รหัสวิชา</th>
              <th className="px-4 py-2">ชื่อวิชา</th>
              
              <th className="px-4 py-2">รหัสข้อสอบ</th> {/* แสดง Exam ID */}
              <th className="px-4 py-2">สถานะ</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {statuses.map((status) => (
              <tr key={status.subid}> {/* ใช้ subid เป็น key */}
                <td className="border px-4 py-2">{status.Subid}</td>
                <td className="border px-4 py-2">{status.subjects?.Subname}</td> {/* ดึงชื่อวิชา */}
                
                <td className="border px-4 py-2">{status.exams?.examid}</td> {/* แสดง Exam ID */}
                <td className="border px-4 py-2">
                  <div className="flex flex-row items-center justify-center space-x-4">
                    {['Waiting', 'Fail', 'Process', 'Success'].map((possibleStatus) => (
                      <label key={possibleStatus} className="flex flex-col items-center">
                        <input
                          className="h-4 w-4 mb-2"
                          type="radio"
                          name={`status-${status.Subid}`} // ชื่อเดียวกันสำหรับสถานะเดียวกัน
                          checked={status.status === possibleStatus} // เช็คสถานะปัจจุบัน
                          onChange={() => updateStatus(status.Subid, possibleStatus)} // เรียกใช้งานฟังก์ชันเมื่อเปลี่ยนสถานะ
                        />
                        <span>{possibleStatus}</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
