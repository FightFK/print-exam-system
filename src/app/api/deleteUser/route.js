import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
  const { uid } = await request.json(); // รับ uid จาก body

  try {
    // ลบผู้ใช้จากระบบ authenticated
    const { error: authError } = await supabase.auth.admin.deleteUser(uid);

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
    }

    // ลบข้อมูลผู้ใช้จากตาราง users โดยใช้ uid
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .match({ uid }); // เปลี่ยนจาก email เป็น uid

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully.' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
