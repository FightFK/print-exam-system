"use client"; // ต้องการการทำงานในฝั่ง Client

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // นำเข้า Supabase client

export default function Page() {
    const [statuses, setStatuses] = useState([]); // ใช้เพื่อเก็บสถานะของวิชา
    const [loading, setLoading] = useState(true); // ใช้เพื่อแสดงสถานะการโหลดข้อมูล

    useEffect(() => {
        fetchStatuses(); // เรียกใช้ฟังก์ชันเพื่อดึงสถานะทั้งหมดเมื่อคอมโพเนนต์ถูกสร้าง
    }, []);

    const fetchStatuses = async () => {
        const { data, error } = await supabase
            .from('status') // ตารางสถานะ
            .select(`
                *,
                subjects (
                    *,
                    users (
                        *
                    )
                )
            `); // ใช้การรวมข้อมูล (join) ตาราง subjects และ users

        if (error) {
            console.error('Error fetching statuses:', error.message);
        } else {
            setStatuses(data); // เก็บข้อมูลใน state
        }

        setLoading(false); // เปลี่ยนสถานะการโหลด
    };

    if (loading) {
        return <p>Loading...</p>; // แสดงข้อความขณะรอข้อมูล
    }

    // ฟังก์ชันในการกำหนดสีตามสถานะ
    const getStatusColor = (status) => {
        switch (status) {
            case 'Failed':
                return 'text-red-500'; // สีแดง
            case 'waiting':
                return 'text-yellow-500'; // สีเหลือง
            case 'Process':
                return 'text-blue-500'; // สีน้ำเงิน
            case 'Success':
                return 'text-green-500'; // สีเขียว
            default:
                return 'text-gray-700'; // สีเทาสำหรับสถานะที่ไม่รู้จัก
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4">
            <h2 className="text-xl font-semibold mb-4">สถานะของข้อสอบทั้งหมด</h2>
            {statuses.length > 0 ? (
                statuses.map((statusItem, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm">
                        <h3 className="text-lg font-semibold">รหัสวิชา: {statusItem.subjects?.Subid}  รายวิชา: {statusItem.subjects?.Subname}  </h3>
                        <p className={`font-medium ${getStatusColor(statusItem.status)}`}>สถานะ: {statusItem.status}</p>
                        <p className="text-gray-500">อาจารย์: {statusItem.subjects?.users?.full_name || 'ไม่พบอาจารย์'}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-700">ไม่พบสถานะวิชาสอบใดๆ</p>
            )}
        </div>
    );
}
