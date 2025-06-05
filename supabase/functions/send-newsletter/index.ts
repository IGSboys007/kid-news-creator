
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childId } = await req.json();

    // Get child and parent information
    const { data: child, error: childError } = await supabase
      .from('children')
      .select(`
        *,
        parent:parent_id (
          email
        )
      `)
      .eq('id', childId)
      .single();

    if (childError || !child) {
      throw new Error('Child not found');
    }

    // Get the latest newsletter for this child
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (newsletterError || !newsletter) {
      throw new Error('No newsletter found');
    }

    const parentEmail = child.parent?.email;
    if (!parentEmail) {
      throw new Error('Parent email not found');
    }

    // Convert newsletter content to HTML
    const newsletterText = newsletter.content?.text || '';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${newsletter.title}</title>
          <style>
            body { 
              font-family: 'Comic Sans MS', cursive, sans-serif; 
              line-height: 1.6; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .content { 
              background: white;
              padding: 20px; 
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .section { 
              margin-bottom: 20px; 
              padding: 15px;
              border-left: 4px solid #667eea;
              background-color: #f8f9ff;
            }
            .footer { 
              text-align: center; 
              margin-top: 20px; 
              color: #666; 
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📰 ${newsletter.title}</h1>
            <p>A personalized newsletter just for ${child.name}! 🌟</p>
          </div>
          <div class="content">
            <div class="section">
              ${newsletterText.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div class="footer">
            <p>Made with ❤️ for ${child.name} • Kids Newsletter</p>
            <p>This newsletter was created based on ${child.name}'s interests and age.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Kids Newsletter <newsletters@kidsnewsletter.com>",
      to: [parentEmail],
      subject: `📰 ${child.name}'s Daily Discovery Newsletter`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
