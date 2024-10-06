import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request) {
    try {
        // ดึง UID จาก query parameters
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');

        // ตรวจสอบว่า UID ถูกส่งมาหรือไม่
        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID is required' }), { status: 400 });
        }

        const { data, error } = await supabase
            .from('users') // เปลี่ยนเป็นตารางที่เก็บข้อมูลผู้ใช้
            .select('full_name') // เปลี่ยนเป็นคอลัมน์ที่ต้องการดึงข้อมูล
            .eq('id', uid) // ใช้ UID ในการค้นหา
            .single(); // ค้นหาเพียง 1 แถว

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (!data) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        // ส่งชื่อผู้ใช้กลับ
        return new Response(JSON.stringify({ name: data.full_name }), { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
