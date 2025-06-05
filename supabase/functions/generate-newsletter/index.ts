
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childId } = await req.json();

    // Fetch child details
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !child) {
      throw new Error('Child not found');
    }

    // Generate newsletter content using OpenAI
    const prompt = `Create a fun, educational newsletter for ${child.name}, age ${child.age}. 
    
    Child's interests: ${child.interests.join(', ')}
    Favorite shows: ${child.favorite_shows || 'Not specified'}
    Hobbies: ${child.hobbies || 'Not specified'}
    Grade: ${child.grade || 'Not specified'}
    
    Create content that includes:
    1. A fun science fact related to their interests
    2. A math puzzle or brain teaser appropriate for their age
    3. A short story or fun fact about one of their interests
    4. A creative activity they can do at home
    5. A "Did You Know?" section with an amazing fact
    
    Format this as a structured newsletter with clear sections. Keep the language age-appropriate and engaging. Make it printable-friendly with simple formatting.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a creative educational content writer who specializes in creating engaging, age-appropriate newsletters for children. Your content should be fun, educational, and inspire curiosity.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    const aiResponse = await response.json();
    const newsletterContent = aiResponse.choices[0].message.content;

    // Save newsletter to database
    const today = new Date().toISOString().split('T')[0];
    const title = `${child.name}'s Daily Discovery - ${today}`;

    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .insert({
        child_id: childId,
        title: title,
        content: { text: newsletterContent },
      })
      .select()
      .single();

    if (newsletterError) {
      throw newsletterError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      newsletter,
      content: newsletterContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-newsletter function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
