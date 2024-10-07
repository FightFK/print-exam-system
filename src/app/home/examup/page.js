"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 

export default function Page() {
    const [email, setEmail] = useState(null);
    const [exam, setExam] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [file, setFile] = useState(null);
    
    useEffect(() => {
        const fetchUserEmail = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setEmail(session.user.email);
                fetchExams(session.user.email);
            }
        };
  
        fetchUserEmail();
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

    const handleViewClick = (examItem) => {
        setSelectedExam(examItem);
        setIsModalOpen(true);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // เก็บไฟล์ที่เลือกใน state
    };

    const handleUploadClick = async (examItem) => {
        if (!file) {
            alert('กรุณาเลือกไฟล์ก่อนอัปโหลด');
            return;
        }

        try {
            // ตัวอย่างการอัปโหลดไฟล์ไปที่ Supabase Storage
            const { data, error } = await supabase.storage
                .from('exams') // สมมติว่าคุณมี bucket ชื่อ exams ใน Supabase
                .upload(`public/${examItem.examid}/${file.name}`, file);

            if (error) {
                console.error('Error uploading file:', error);
                return;
            }

            // บันทึกลิงก์ไฟล์ที่อัปโหลดในฐานข้อมูล (ตัวอย่างใช้การอัปเดต table exams)
            const { data: updatedExam, error: updateError } = await supabase
                .from('exams')
                .update({ exam_link_file: data?.path })
                .eq('examid', examItem.examid);

            if (updateError) {
                console.error('Error updating exam with file link:', updateError);
            } else {
                alert('อัปโหลดไฟล์สำเร็จ');
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4">
            {exam.length > 0 ? (
                exam.map((examItem, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm transition-transform transform hover:scale-105">
                        <h3 className="text-lg font-semibold text-blue-600">รหัสวิชา: {examItem.subjects?.Subid}</h3>
                        <p className="text-gray-700">ชื่อวิชา: {examItem.subjects?.Subname || 'ไม่พบชื่อวิชา'}</p>
                        <p className="text-gray-500">สอบวันที่: {new Date(examItem.date).toLocaleString()}</p>
                        <div className="flex space-x-2 mt-2">
                            <button 
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                onClick={() => handleViewClick(examItem)}
                            >
                                View
                            </button>
                            
                            <div className="flex justify-end space-x-2 mt-2">
                                    <input 
                                        type="file" 
                                        className="bg-white border rounded-md text-sm cursor-pointer mt-1"
                                        onChange={handleFileChange} 
                                        disabled={examItem.exam_link_file !== null} 
                                    />
                                    <button 
                                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${examItem.exam_link_file !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleUploadClick(examItem)} 
                                        disabled={examItem.exam_link_file !== null} 
                                    >
                                        Upload
                                    </button>
                                </div>



                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-700">ไม่พบข้อมูลข้อสอบ</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-4 max-w-lg w-full shadow-lg">
                        <h3 className="text-lg font-semibold">รายละเอียดข้อสอบ</h3>
                        {selectedExam && (
                            <div>
                                <p>รหัสข้อสอบ: {selectedExam.examid}</p>
                                <p>ชื่อวิชา: {selectedExam.subjects?.Subname || 'ไม่พบชื่อวิชา'}</p>
                                <p>รหัสวิชา: {selectedExam.subid}</p>
                                <p>UID: {selectedExam.UID}</p>
                                <p>วันที่: {new Date(selectedExam.date).toLocaleString()}</p>
                                <p>ลิงก์ข้อสอบ: {selectedExam.exam_link_file || 'ไม่มีลิงก์'}</p>
                                <p>ประเภทการพิมพ์: {selectedExam.type_of_print}</p>
                                <p>หน่วย: {selectedExam.unit}</p>
                                <p>ส่งโดย: {selectedExam.sender_exam}</p>
                                <p>ภาคการศึกษา: {selectedExam.semester}</p>
                                <p>ต้องการกระดาษคำตอบ: {selectedExam.req_answer_sheet}</p>
                                <p>หมวด: {selectedExam.section}</p>
                                <p>คำอธิบายเพิ่มเติม: {selectedExam.additional_desc || 'ไม่มีคำอธิบาย'}</p>
                                <p>สาขาวิชา: {selectedExam.field_of_study}</p>
                                <p>เริ่มสอบ: {selectedExam.start_exam}</p>
                                <p>สิ้นสุดสอบ: {selectedExam.end_exam}</p>
                                <p>ห้อง: {selectedExam.room}</p>
                                <p>อุปกรณ์: {selectedExam.equipment}</p>
                                <p>ประเภทข้อสอบ: {selectedExam.type_of_exam}</p>
                                <p>โทรศัพท์ผู้ส่ง: {selectedExam.tel_sender_exam}</p>
                                <p>โทรศัพท์ผู้ประสานงาน: {selectedExam.tel_coordinator_exam}</p>
                               
                            </div>
                        )}
                        <button 
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
