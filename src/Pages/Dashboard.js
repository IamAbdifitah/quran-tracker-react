import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [completedJuz, setCompletedJuz] = useState([]);
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  // ✅ MARKA PAGE LOAD GARO
  useEffect(() => {
    loadProgress();
  }, []);

  // ✅ LOAD USER JUZ PROGRESS (FIXED)
  const loadProgress = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("getUser error:", authError);
        window.location.href = "/";
        return;
      }

      if (!authData?.user) {
        window.location.href = "/";
        return;
      }

      const { data, error } = await supabase
        .from("progress")
        .select("juz")
        .eq("user_id", authData.user.id)
        .eq("completed", true);

      if (error) {
        console.error("progress fetch error:", error);
        setCompletedJuz([]);
        return;
      }

      setCompletedJuz(data ? data.map(j => j.juz) : []);
    } catch (err) {
      console.error("loadProgress error:", err);
      setCompletedJuz([]);
    }
  };

  // ⚡ UI DEGDEG + SAVE BACKGROUND
  const completeJuz = (juz) => {
    if (completedJuz.includes(juz)) return;

    // UI marka hore
    setCompletedJuz(prev => [...prev, juz]);

    saveToDatabase(juz);
  };

  const saveToDatabase = async (juz) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("getUser error on save:", authError);
        return;
      }
      if (!authData?.user) return;

      const { error } = await supabase.from("progress").insert({
        user_id: authData.user.id,
        juz: juz,
        completed: true,
      });

      if (error) console.error("insert progress error:", error);
    } catch (err) {
      console.error("saveToDatabase error:", err);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <h2>📖 Qur'an Reading Dashboard</h2>

        <div className="juz-grid">
          {juzList.map(juz => {
            const done = completedJuz.includes(juz);
            return (
              <button
                key={juz}
                className={`juz-btn ${done ? "done" : ""}`}
                disabled={done}
                onClick={() => completeJuz(juz)}
              >
                {done ? `✔ Juz ${juz}` : `Juz ${juz}`}
              </button>
            );
          })}
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
