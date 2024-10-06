import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) { // ใช้ POST สำหรับการลบ
    const { SubjectID } = await request.json(); // รับ SubjectID จาก body ของ request
    console.log(SubjectID)
    console.log('Received SubjectId for deletion:', SubjectID); // ตรวจสอบ SubjectID ที่รับมา

    // ตรวจสอบว่ามี SubjectID หรือไม่
    if (!SubjectID) {
        return new Response(JSON.stringify({ error: 'Subject ID Is Not Found' }), { status: 400 });
    }

    try {
        // ลบข้อมูลจากตาราง 'subjects'
        const { data, error: dbError } = await supabase
            .from('subjects')
            .delete()
            .eq('Subid', SubjectID); 

        // ตรวจสอบว่ามีข้อผิดพลาดในการลบ
        if (dbError) {
            return new Response(JSON.stringify({ error: dbError.message }), { status: 400 });
        }

        // หากไม่มีข้อมูลที่ถูกลบ
        if (data.length === 0) {
            return new Response(JSON.stringify({ error: 'No subject found with the given ID' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Subject deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting Subject:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
