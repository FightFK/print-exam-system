// app/api/getUsers/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request) {
    try {
        // ใช้ nested select เพื่อดึงข้อมูลจากตาราง subjects และ users ผ่าน foreign keys
        const { data, error } = await supabase
            .from('exams')
            .select(`
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
                tel_coordinator_exam,
                additional_desc,
                subjects (Subid, Subname,Nums_of_student), 
                users (id, full_name)             
            `);
        
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        // ส่งข้อมูลที่ดึงมาได้กลับไปยัง client
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
