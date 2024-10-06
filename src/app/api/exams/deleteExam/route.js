import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
    const { examId } = await request.json(); // รับ examId จาก body ของ request

    // ตรวจสอบว่ามี examId หรือไม่
    if (!examId) {
        return new Response(JSON.stringify({ error: 'Exam ID Is Not Found' }), { status: 400 });
    }

    try {
        // ลบข้อมูลจากตาราง 'exams'
        const { data, error: dbError } = await supabase
            .from('exams')
            .delete()
            .eq('examid', examId);

        // ตรวจสอบว่ามีข้อผิดพลาดในการลบ
        if (dbError) {
            return new Response(JSON.stringify({ error: dbError.message }), { status: 400 });
        }

        // หากไม่มีข้อมูลที่ถูกลบ
        if (data.length === 0) {
            return new Response(JSON.stringify({ error: 'No exam found with the given ID' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Exam deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting Exam:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
