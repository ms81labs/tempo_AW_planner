import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the user from the auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get request params
    const { championClass } = await req.json();

    // Fetch champions by class
    let query = supabaseClient.from("champions").select("*");

    if (championClass && championClass !== "all") {
      query = query.eq("class", championClass.toLowerCase());
    }

    const { data: champions, error: championsError } =
      await query.order("name");

    if (championsError) {
      return new Response(JSON.stringify({ error: championsError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch user's champions
    const { data: userChampions, error: userChampionsError } =
      await supabaseClient
        .from("user_champions")
        .select(
          `
        id,
        rarity,
        rank,
        champion_id
      `,
        )
        .eq("user_id", user.id);

    if (userChampionsError) {
      return new Response(
        JSON.stringify({ error: userChampionsError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Combine the data
    const result = {
      champions,
      userChampions,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
