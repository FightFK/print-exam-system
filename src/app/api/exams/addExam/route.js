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
      subid, // เพิ่ม subid ที่นี่
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
      tel_coordinator_exam,
      status, // เพิ่ม status ที่นี่
    } = body;

    // Insert ข้อมูลลงในตาราง 'exams'
    const { data: examData, error: examError } = await supabase
      .from('exams') // ชื่อตารางใน Supabase
      .insert([
        {
          examid,
          subid, // ใส่ subid เข้าไป
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
          tel_coordinator_exam,
        }
      ]);

    // เช็ค error ในการ insert ตาราง exams
    if (examError) {
      console.error("Error inserting data into exams:", examError);
      return new Response(JSON.stringify({ error: examError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert ข้อมูลลงในตาราง 'status'
    const { data: statusData, error: statusError } = await supabase
      .from('status') // ชื่อตารางที่สองใน Supabase
      .insert([
        {
          examid: examid, // ส่ง examid
          Subid: subid, // ส่ง subid
          status: 'waiting', // ส่ง status
        }
      ]);

    // เช็ค error ในการ insert ตาราง status
    if (statusError) {
      console.error("Error inserting data into status:", statusError);
      return new Response(JSON.stringify({ error: statusError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ส่ง response กลับถ้าไม่มี error
    return new Response(JSON.stringify({ examData, statusData }), {
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
