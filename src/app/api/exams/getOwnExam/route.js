    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    export async function POST(request) {
        try {
            // ดึง email จาก body ของ request
            const { email } = await request.json(); 
            console.log('Received email:', email);
            
            // ตรวจสอบว่า email มีค่า
            if (!email) {
                return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
            }

            // ขั้นตอนที่ 1: ดึง UID จาก users โดยใช้ email
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id') // ดึง id (UID)
                .eq('email', email) // กรองตาม email
                .single(); // เนื่องจากเราคาดว่ามีผู้ใช้เพียงคนเดียวที่มี email นี้ มันแน่นอนอยู่ละ

            if (userError) {
                return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
            }

            // ตรวจสอบว่าได้ UID หรือไม่
            if (!userData) {
                return new Response(JSON.stringify({ error: 'No user found with this email' }), { status: 404 });
            }

            const userId = userData.id; // เก็บ UID ที่ได้จากผู้ใช้
            console.log('User ID:', userId);

            // ขั้นตอนที่ 2: ใช้ UID ที่ได้เพื่อดึงข้อมูลจาก exams
            const { data: examsData, error: examError } = await supabase
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
                    subjects (Subid, Subname)
                `)
                .eq('UID', userId); // กรองตาม UID

            if (examError) {
                return new Response(JSON.stringify({ error: examError.message }), { status: 400 });
            }

            // ส่งข้อมูลที่ดึงมาได้กลับไปยัง client
            return new Response(JSON.stringify(examsData || []), { status: 200 }); // ถ้าไม่มีข้อมูลให้ส่งเป็น array เปล่า

        } catch (error) {
            console.error('Error fetching exams:', error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    }
