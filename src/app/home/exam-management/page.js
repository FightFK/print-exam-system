"use client";
import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

export default function Page() {
  const [exam, setExam] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

      {/* Modal สำหรับเพิ่มข้อมูล */}
      {showModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">เพิ่มข้อสอบ</h2>
      <div className="flex flex-col space-y-4">
        {/* Exam ID */}
        <input
          type="text"
          name="examid"
          placeholder="รหัสข้อสอบ"
          value={formData.examid}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Subject Selection */}
        <select
          name="subid"
          value={formData.subid}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="">เลือกวิชา</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.subid}>
              {subject.Subid}
            </option>
          ))}
        </select>

        {/* Tutor Selection */}
        <select
          name="UID"
          value={formData.UID}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="">เลือกอาจารย์</option>
          {tutors.map((tutor) => (
            <option key={tutor.id} value={tutor.id}>
              {tutor.id} - {tutor.full_name}
            </option>
          ))}
        </select>

        {/* Date and Time */}
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Start and End Exam Time */}
        <div className="flex space-x-2">
          <input
            type="time"
            name="start_exam"
            value={formData.start_exam}
            onChange={handleInputChange}
            className="p-2 border rounded"
            placeholder="เวลาเริ่มสอบ"
          />
          <input
            type="time"
            name="end_exam"
            value={formData.end_exam}
            onChange={handleInputChange}
            className="p-2 border rounded"
            placeholder="เวลาสิ้นสุดสอบ"
          />
        </div>

        {/* Room */}
        <input
          type="text"
          name="room"
          placeholder="ห้องสอบ"
          value={formData.room}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Field of Study */}
        <input
          type="text"
          name="field_of_study"
          placeholder="สาขาวิชา"
          value={formData.field_of_study}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Semester */}
        <input
          type="text"
          name="semester"
          placeholder="ภาคการศึกษา"
          value={formData.semester}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Type of Exam */}
        <input
          type="text"
          name="type_of_exam"
          placeholder="ประเภทข้อสอบ"
          value={formData.type_of_exam}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Equipment Required */}
        <select
          name="equipment"
          value={formData.equipment}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="No">อุปกรณ์เสริม (ไม่มี)</option>
          <option value="Yes">อุปกรณ์เสริม (มี)</option>
        </select>

        {/* Type of Print */}
        <select
          name="type_of_print"
          value={formData.type_of_print}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="หน้าเดียว">หน้าเดียว</option>
          <option value="สองหน้า">สองหน้า</option>
        </select>

        {/* Units of Exam */}
        <input
          type="number"
          name="unit"
          placeholder="จำนวนชุดข้อสอบ"
          value={formData.unit}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Request for Answer Sheet */}
        <select
          name="req_answer_sheet"
          value={formData.req_answer_sheet}
          onChange={handleInputChange}
          className="p-2 border rounded"
        >
          <option value="yes">ต้องการกระดาษคำตอบ</option>
          <option value="no">ไม่ต้องการกระดาษคำตอบ</option>
        </select>

        {/* Contact Information */}
        <input
          type="tel"
          name="tel_sender_exam"
          placeholder="เบอร์โทรผู้ส่งข้อสอบ"
          value={formData.tel_sender_exam}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        <input
          type="tel"
          name="tel_coordinator_exam"
          placeholder="เบอร์โทรผู้ประสานงานสอบ"
          value={formData.tel_coordinator_exam}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Additional Description */}
        <textarea
          name="additional_desc"
          placeholder="คำอธิบายเพิ่มเติม"
          value={formData.additional_desc}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />

        {/* Buttons for submission and cancellation */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleAddExam}
        >
          บันทึก
        </button>
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          onClick={() => setShowModal(false)}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
)}


      {/* Body */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full mt-5">
        <thead className="w-full bg-pink-500 border-b">
                        <tr className="w-full bg-pink-500 border-b">
                            <th className="py-2 px-4 text-white">รหัสข้อสอบ</th>
                            <th className="py-2 px-4 text-white">ชื่อวิชา</th>
                            <th className="py-2 px-4 text-white">ผู้สอน</th>
                            <th className="py-2 px-4 text-white">วัน/เวลาที่สอบ</th>
                            <th className="py-2 px-4 text-white">สาขาวิชา</th>
                            <th className="py-2 px-4 text-white">ภาคการศึกษา</th>
                            <th className="py-2 px-4 text-white">ลิ้งค์จัดเก็บไฟล์ข้อสอบ</th>
                            <th className="py-2 px-4 text-white">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-center">
                        {exam.length > 0 ? (
                            exam.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{item?.examid}</td>
                                <td className="py-2 px-4">{item?.subjects?.Subname}</td>
                                <td className="py-2 px-4">{item?.users?.full_name}</td>
                                <td className="py-2 px-4">{item?.date}</td>
                                <td className="py-2 px-4">{item?.field_of_study}</td>
                                <td className="py-2 px-4">{item?.semester}</td>
                                <td className="py-2 px-4">
                                <a href={item?.exam_link_file} target="_blank" rel="noopener noreferrer">
                                    ดาวน์โหลด
                                </a>
                                </td>
                                <td className="py-2 px-4">
                                <button
                                    onClick={() => handleDeleteExam(item.examid)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="8" className="py-4">ไม่มีข้อมูลข้อสอบ</td>
                            </tr>
                        )}
                        </tbody>
        </table>
      </div>
    </div>
  );
}
