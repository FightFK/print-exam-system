// app/api/getUsers/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request) {
    try {
        const { data, error } = await supabase
            .from('subjects') // แก้ไขให้ดึงข้อมูลจากตาราง 'users'
            .select('*') // ดึงข้อมูลทั้งหมด

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        // ส่งข้อมูลผู้ใช้กลับไป
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
