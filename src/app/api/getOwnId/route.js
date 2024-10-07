import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
    try {
        const { email } = await request.json(); // Extract email from the request body
      
        
        // Check if email is provided
        if (!email) {
            console.log('Email is required');
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        // Fetch user ID from the users table using email
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError) {
            console.log('User fetch error:', userError.message);
            return new Response(JSON.stringify({ error: userError.message }), { status: 404 });
        }

        if (!userData) {
            console.log('User not found');
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const userId = userData.id;
        console.log('User ID:', userId);

        return new Response(JSON.stringify({ userId }), { status: 200 }); 
    } catch (error) {
        console.error('Error in API:', error); // Log error details
        return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
    }
}

  
  
