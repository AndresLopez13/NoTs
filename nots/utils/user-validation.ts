import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export async function validateUser(
  payload: RealtimePostgresChangesPayload<any>
): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id === payload.new.user_id;
}
