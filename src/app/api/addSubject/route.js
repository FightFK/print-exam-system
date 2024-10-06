// app/api/addSubject/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
    const { SubID, SubName, UID, Year, Terms, Semester, Nums_of_student } = await request.json();
    
    // ตรวจสอบข้อมูลที่ได้รับ
    if (!SubID || !SubName || !UID || !Year || !Terms || !Semester || !Nums_of_student) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    try {
        // เพิ่มข้อมูล subject ลงในตาราง 'subjects'
        const { data, error } = await supabase
            .from('subjects')
            .insert([
                {
                    Subid: SubID,               // ใช้ค่าที่ได้จาก request
                    Subname: SubName,           // ใช้ค่าที่ได้จาก request
                    UID: UID,                   // ใช้ค่าที่ได้จาก request
                    Year: Year,                 // ใช้ค่าที่ได้จาก request
                    Terms: Terms,               // ใช้ค่าที่ได้จาก request
                    Semester: Semester,         // ใช้ค่าที่ได้จาก request
                    Nums_of_student: Nums_of_student // ใช้ค่าที่ได้จาก request
                }
            ]);
            

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: 'Subject added successfully' }), { status: 201 });
    } catch (error) {
        console.error('Error adding subject:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
