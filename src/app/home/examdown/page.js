"use client"
import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

export default function Page() {
  const [exam, setExam] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
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
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);

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
    fetchExams();
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
        await fetchExams();
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
        });
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
          body: JSON.stringify({ examId }),
        });

        if (response.ok) {
          await fetchExams();
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

  const handlePrintCover = (exam) => {
    
    const coverContent = `
    <html>
      <head>
        
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            text-align: center;
          }
          h1, h2, h3, h4 {
            margin: 10px 0;
          }
          p {
            line-height: 1.6;
            margin: 5px 0;
          }
          table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            border: 1px solid #000;
          }
          th {
            background-color: #f2f2f2;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          img { 
            max-width: 100px; /* ปรับขนาดโลโก้ให้มีความกว้างสูงสุดที่ 100px */
            height: auto; /* ความสูงจะปรับโดยอัตโนมัติเพื่อรักษาสัดส่วน */
            display: block; /* ทำให้แน่ใจว่าภาพอยู่ในบล็อก */
            margin: 0 auto; /* จัดวางภาพให้ตรงกลาง */
          }
          .spacer {
            height: 20px; /* กำหนดความสูงที่ต้องการสำหรับการเว้นระยะ */
          }
        </style>
      </head>
      <body>
        <img src="/images/logo-psu.jpg" alt="Logo"/>
        <h1>คณะวิทยาศาสตร์</h1>
        <h2>มหาวิทยาลัยสงขลานครินทร์</h2>
        <p>การสอบวิชา: ${exam.subjects?.Subname}  รหัสวิชา: ${exam.subjects?.Subid}</p>
        
        <p>
          วันที่: ${new Date(exam.date).toLocaleString()}<br>
          ห้องสอบ: ${exam.room}<br>
          จำนวนนักศึกษา: ${exam.subjects?.Nums_of_student} คน<br>
          ซองนี้มีข้อสอบ: ${exam.subjects?.Nums_of_student + 2} ชุด<br>
          มีผู้ไม่เข้าสอบ: ..... คน (นักคณะ....ดอน ${exam.section})<br>
          อุปกรณ์ที่ใช้ในห้องสอบเพิ่มเติม: <br>
          ${exam.additional_desc ? exam.additional_desc : ''}
        </p>
  
        <p>ผู้ออกข้อสอบ: ${exam.users?.full_name}</p>
  
        <p>จำนวนนักศึกษาที่เข้าห้องสอบ........ จำนวนนักศึกษาที่ขาดสอบ:....... คือ</p>
  
        <div class="spacer"></div> <!-- ใช้ div สำหรับการเว้นระยะ -->
        
        <p>รหัส     ชื่อ-สกุล                                      รหัส     ชื่อ-สกุล</p>
        <p>.........................                                  .......................</p>
        <p>.........................                                  .......................</p>
        <p>.........................                                  .......................</p>
      </body>
    </html>
  `;
  
  
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(coverContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col h-full bg-gray-200">
      <div className="p-7 bg-pink-500 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">ดาวน์โหลดข้อสอบ</h1>
        
      </div>

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
                      <>
                        <a
                          href={"https://lmwetixdzcqaxxbvcpug.supabase.co/storage/v1/object/public/exams/" + item.exam_link_file}
                          className="text-blue-500 hover:underline"
                          download
                        >
                          ดาวน์โหลดข้อสอบ
                        </a>
                        <button
                          onClick={() => handlePrintCover(item)}
                          className="text-blue-500 hover:underline ml-4"
                        >
                          ปริ้นปกข้อสอบ
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">ไม่มีไฟล์ข้อสอบ</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  ไม่มีข้อสอบที่แสดง
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     
    </div>
  );
}
