import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) { // ใช้ POST สำหรับการลบ
    const { userId } = await request.json(); // รับ userId จาก body ของ request
    console.log('Received userId for deletion:', userId); // ตรวจสอบ userId ที่รับมา

    // ตรวจสอบว่ามี userId หรือไม่
    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    try {
    
        // ลบข้อมูลผู้ใช้จากตาราง 'users'
        const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId); // สมมติว่ามีคอลัมน์ 'id' ในตาราง 'users'

        if (dbError) {
            return new Response(JSON.stringify({ error: dbError.message }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
