"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 

export default function Page() {
    const [email, setEmail] = useState(null);
    const [exam, setExam] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('Teacher'); // กำหนดค่าเริ่มต้นของ role เป็น Teacher
    const [loading, setLoading] = useState(true); // Loading state for fetching data

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error('Error fetching session:', sessionError.message);
                return;
            }
            if (session) {
                const userEmail = session.user.email;
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('role') // ดึง role จากตาราง users
                    .eq('email', userEmail)
                    .single();

                if (error) {
                    console.error('Error fetching user role:', error.message);
                } else if (userData) {
                    setRole(userData.role); // ตั้งค่า role ที่ได้รับจากเซิร์ฟเวอร์
                    setEmail(userEmail); // Set the user email
                    fetchExams(userEmail); // Fetch exams for the user
                }
            }
            setLoading(false); // Set loading to false after fetching data
        };

        fetchUserRole();
    }, []);

    const fetchExams = async (email) => {
        if (!email) {
            console.error('No email provided');
            return;
        }

        try {
            const response = await fetch('/api/exams/getOwnExam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error('Error fetching exams:', data.error || 'Unknown error');
                return;
            }

            setExam(data); 
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Filter exams to show only those without an uploaded file
    const pendingExams = exam.filter(examItem => examItem.exam_link_file === null);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4">
            {loading ? (
                <p className="text-gray-700">กำลังโหลดข้อมูล...</p> // Loading message
            ) : (
                role === 'Teacher' && (
                    <>
                        <h2 className="text-xl font-semibold mb-4 text-red-600">แจ้งเตือนวิชาที่ยังไม่ส่งข้อสอบ</h2>
                        {pendingExams.length > 0 ? (
                            pendingExams.map((examItem) => (
                                <div key={examItem.examid} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm transition-transform transform hover:scale-105">
                                    <h3 className="text-lg font-semibold text-blue-600">รหัสวิชา: {examItem.subjects?.Subid}</h3>
                                    <p className="text-gray-700">ชื่อวิชา: {examItem.subjects?.Subname || 'ไม่พบชื่อวิชา'}</p>
                                    <p className="text-gray-500">สอบวันที่: {new Date(examItem.date).toLocaleString()}</p>
                                    <p className="text-red-500 mt-2">🔴 กรุณาอัปโหลดไฟล์ข้อสอบ!</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-700">ไม่พบข้อมูลข้อสอบที่ยังไม่ได้ส่ง</p>
                        )}
                    </>
                )
            )}
            { role === 'Admin' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-20 rounded relative" role="alert">
                  <strong className="font-bold">Hello, Admin!</strong>
                  <span className="block sm:inline"> คุณมีสิทธิ์ในการจัดการ User.</span>
             </div>
            )
            }
             { role === 'Tech' && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-20 rounded relative" role="alert">
                  <strong className="font-bold">Hello, Tech!</strong>
                  <span className="block sm:inline"> คุณพร้อมพิมพ์ข้อสอบรึยัง ? .</span>
             </div>
            )
            }
             { role === 'Officer' && (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-20 rounded relative" role="alert">
                  <strong className="font-bold">Hello, Officer!</strong>
                  <span className="block sm:inline"> คุณมีหน้าที่ดูแลข้อสอบและรายวิชา.</span>
             </div>
            )
            }
             { role === 'Developer' && (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-20 rounded relative" role="alert">
                  <strong className="font-bold">Hello, Developer!</strong>
                  <span className="block sm:inline"> แก้โค้ดบัควนไป </span>
             </div>
            )
            }
        </div>
    );
}
