import { getSession, getUserProfile } from "@/lib/supabase/server";

export default async function Debug() {
  const session = await getSession();
  const profile = await getUserProfile();

  return (
    <pre>
      SESSION:
      {JSON.stringify(session, null, 2)}

      PROFILE:
      {JSON.stringify(profile, null, 2)}
    </pre>
  );
}
