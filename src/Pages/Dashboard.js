import { useState } from "react";
import { getCurrentUser, logout } from "../utils/storage";
import "../styles/dashboard.css";

export default function Dashboard() {
  const user = getCurrentUser();

  // ❗ Hook mar walba waa in kor la yeeraa
  const storageKey = user ? `progress_${user.email}` : null;

  const [progress, setProgress] = useState(
    storageKey
      ? JSON.parse(localStorage.getItem(storageKey)) || {}
      : {}
  );

  // kadib ayaad condition gelin kartaa
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  const markJuz = (juz) => {
    const updated = { ...progress, [juz]: !progress[juz] };
    setProgress(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <h2>Welcome, {user.name}</h2>

        <div className="juz-grid">
          {[...Array(30)].map((_, i) => (
            <button
              key={i}
              className={progress[i + 1] ? "done" : ""}
              onClick={() => markJuz(i + 1)}
            >
              Juz {i + 1}
            </button>
          ))}
        </div>

        <button
          className="logout"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
