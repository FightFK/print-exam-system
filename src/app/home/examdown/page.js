"use client";
import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

export default function Page() {
  const [exam, setExam] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalView, setShowModalView] = useState(false); // Modal View state
  const [selectedExam, setSelectedExam] = useState(null); // Exam data for viewing
  const [formData, setFormData] = useState({
    examid: "",
    subid: "",
    UID: "",
    date: "",
    exam_link_file: null,
    type_of_print: "หน้าเดียว",
    unit: 2,
    sender_exam: "-",
    semester: "2024",
    req_answer_sheet: "yes",
    section: 1,
    additional_desc: null,
    field_of_study: "Computer-Sci",
    start_exam: "10:00",
    end_exam: "12:00",
    room: "BSC0605",
    equipment: "No",
    type_of_exam: "",
    tel_sender_exam: "09",
    tel_coordinator_exam: "12"
  });
  const [subjects, setSubjects] = useState([]); // สำหรับวิชา
  const [tutors, setTutors] = useState([]); // สำหรับอาจารย์

  // ฟังก์ชันดึงข้อมูลวิชา
  const fetchSubjects = async () => {
    const response = await fetch('/api/getSubjects');
    const data = await response.json();
    setSubjects(data);
  };

  // ฟังก์ชันดึงข้อมูลอาจารย์
  const fetchTutors = async () => {
    const response = await fetch('/api/getUsers');
    const data = await response.json();
    setTutors(data);
  };

  // เรียกใช้ฟังก์ชันเมื่อ component ถูก mount
  useEffect(() => {
    fetchSubjects();
    fetchTutors();
    fetchExams(); // ดึงข้อมูลข้อสอบที่มีอยู่
  }, []);

  // ฟังก์ชันดึงข้อมูลข้อสอบ
  const fetchExams = async () => {
    const response = await fetch('/api/exams/getExam');
    const data = await response.json();
    setExam(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddExam = async () => {
    try {
      const response = await fetch("/api/exams/addExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newExam = await response.json();
        await fetchExams(); // เรียกใช้ fetchExams เพื่ออัปเดตข้อมูลในตาราง
        setExam([...exam, newExam]);
        setShowModal(false);
        setFormData({
          examid: "",
          subid: "",
          UID: "",
          date: "",
          exam_link_file: null,
          type_of_print: "หน้าเดียว",
          unit: 2,
          sender_exam: "-",
          semester: "2024",
          req_answer_sheet: "yes",
          section: 1,
          additional_desc: null,
          field_of_study: "Computer-Sci",
          start_exam: "10:00",
          end_exam: "12:00",
          room: "BSC0605",
          equipment: "No",
          type_of_exam: "",
          tel_sender_exam: "09",
          tel_coordinator_exam: "12"
        }); // รีเซ็ตฟอร์ม
      } else {
        console.error("Error adding exam");
      }
    } catch (error) {
      console.error("Error adding exam:", error);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (confirm("คุณแน่ใจว่าต้องการลบข้อสอบนี้?")) {
      try {
        const response = await fetch("/api/exams/deleteExam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examId }), // ส่ง examId ไปยัง API
        });
  
        if (response.ok) {
          await fetchExams(); // เรียกใช้ fetchExams เพื่ออัปเดตข้อมูลในตาราง
        } else {
          console.error("Error deleting exam");
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  const handleViewExam = (exam) => {
    setSelectedExam(exam);
    setShowModalView(true);
  };

  const handleCloseModalView = () => {
    setShowModalView(false);
    setSelectedExam(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-200">
      {/* Header */}
      <div className="p-7 bg-pink-500 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">จัดการข้อสอบ</h1>
        <button
          className="bg-white text-red-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100"
          onClick={() => setShowModal(true)}
        >
          เพิ่มข้อสอบ
        </button>
      </div>

      {/* ตารางข้อสอบ */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">รหัสข้อสอบ</th>
              <th className="py-2 px-4 border-b">ชื่อวิชา</th>
              <th className="py-2 px-4 border-b">ผู้สอน</th>
              <th className="py-2 px-4 border-b">วัน/เวลา</th>
              <th className="py-2 px-4 border-b">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
          {exam.length > 0 ? (
            exam.map((item) => (
              <tr key={item.examid} className="border-b">
                <td className="py-2 px-4">{item.examid}</td>
                <td className="py-2 px-4">{item.subjects?.Subname}</td>
                <td className="py-2 px-4">{item.users?.full_name}</td>
                <td className="py-2 px-4">{item.date}</td>
                <td className="py-2 px-4 text-center">
  {item.exam_link_file ? (
    <a
      href={"https://lmwetixdzcqaxxbvcpug.supabase.co/storage/v1/object/public/exams/"+item.exam_link_file}
      className="text-blue-500 hover:underline"
      download
    >
      ดาวน์โหลดข้อสอบ
    </a>
  ) : (
    <span className="text-gray-400">ไม่มีไฟล์ข้อสอบ</span>
  )}
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 border text-center">
                No exams found.
              </td>
            </tr>
          )}
        </tbody>

        </table>
      </div>

    </div>
  );
}
