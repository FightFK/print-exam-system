// pages/api/exams/addExam.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
  try {
    // ดึงข้อมูลจาก body ที่ถูกส่งมา
    const body = await request.json();
    console.log(body);
    // แยกข้อมูลจาก body
    const {
      examid,
      subid,
      UID,
      date,
      exam_link_file,
      type_of_print,
      unit,
      sender_exam,
      semester,
      req_answer_sheet,
      section,
      additional_desc,
      field_of_study,
      start_exam,
      end_exam,
      room,
      equipment,
      type_of_exam,
      tel_sender_exam,
      tel_coordinator_exam
    } = body;

    // Insert ข้อมูลลงในตาราง 'exams'
    const { data, error } = await supabase
      .from('exams') // ชื่อตารางใน Supabase
      .insert([
        {
          examid,
          subid,
          UID,
          date,
          exam_link_file, // ลิงก์ไฟล์ข้อสอบ
          type_of_print, // ประเภทการพิมพ์ (หน้าเดียว/สองหน้า)
          unit, // จำนวนชุดข้อสอบ
          sender_exam, // ผู้ส่งข้อสอบ
          semester, // ภาคการศึกษา
          req_answer_sheet, // ต้องการกระดาษคำตอบหรือไม่
          section, // หมวดหมู่หรือกลุ่มสอบ
          additional_desc, // คำอธิบายเพิ่มเติม
          field_of_study, // สาขาวิชา
          start_exam, // เวลาเริ่มสอบ
          end_exam, // เวลาสิ้นสุดสอบ
          room, // ห้องสอบ
          equipment, // อุปกรณ์เสริมที่ต้องใช้
          type_of_exam, // ประเภทข้อสอบ
          tel_sender_exam, // เบอร์โทรผู้ส่งข้อสอบ
          tel_coordinator_exam, // เบอร์โทรผู้ประสานงานสอบ
        }
      ]);

    // เช็ค error และ response กลับ
    if (error) {
      console.error("Error inserting data:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ส่ง response กลับถ้าไม่มี error
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // ส่ง response error หากเกิดข้อผิดพลาด
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
