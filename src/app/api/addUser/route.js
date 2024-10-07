import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // URL ของ Supabase
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role API Key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
  const { email, password, full_name, role,Field,Tele } = await request.json();
  console.log({ email, full_name, role, Field,Tele }); // ก่อนทำการ insert

  // 1. เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล 'users'
  const { data: dbData, error: dbError } = await supabase
    .from('users') // เปลี่ยนชื่อ 'users' เป็นชื่อของตารางที่คุณต้องการเพิ่มข้อมูล
    .insert([
      {
        email, // ใช้ email ที่รับมาจาก request
        full_name,
        role,
        Field,
        Tele
      },
    ]);

  // ตรวจสอบข้อผิดพลาดในการเพิ่มข้อมูล
  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 400 });
  }

  try {
    // 2. สร้างผู้ใช้ใหม่ใน Supabase Authentication
    const { user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role,
      },
    });
    
    // ตรวจสอบข้อผิดพลาดในการสร้างผู้ใช้
    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
    }


  

    return new Response(JSON.stringify({ user, dbData }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
