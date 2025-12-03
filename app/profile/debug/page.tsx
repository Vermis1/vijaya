import { getSession, getUserProfile } from "@/lib/supabase/server";

export default async function DebugPage() {
  const session = await getSession();
  const profile = await getUserProfile();

  return (
    <div style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
      <h1>DEBUG PROFILE</h1>

      <br />
      <strong>SESSION:</strong>
      <br />
      {JSON.stringify(session, null, 2)}

      <br /><br />
      <strong>PROFILE:</strong>
      <br />
      {JSON.stringify(profile, null, 2)}
    </div>
  );
}
