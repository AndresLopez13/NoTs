import { supabase } from "@/lib/supabase";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

export async function validateUser(
  payload: RealtimePostgresUpdatePayload<any>
): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  console.log("User id", data.session?.user.id);
  console.log("Payload", payload);
  return data.session?.user.id === payload.new.user_id;
}
