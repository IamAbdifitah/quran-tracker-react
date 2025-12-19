import { getUsers } from "../utils/storage";
import "../styles/dashboard.css";

export default function Admin() {
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  if (!admin) {
    window.location.href = "/login";
    return null;
  }

  const users = getUsers();

  const countJuz = (email) => {
    const progress =
      JSON.parse(localStorage.getItem(`progress_${email}`)) || {};
    return Object.values(progress).filter(Boolean).length;
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <h2 style={{ marginBottom: "5px" }}>Admin Panel</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Monitor users progress and activity
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#2c5364", color: "#fff" }}>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Progress</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => {
                const completed = countJuz(u.email);
                const percent = Math.round((completed / 30) * 100);

                return (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <strong>{completed}/30</strong>
                      <div style={progressBar}>
                        <div
                          style={{
                            ...progressFill,
                            width: `${percent}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* === STYLES === */
const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
};

const progressBar = {
  marginTop: "6px",
  width: "100%",
  height: "6px",
  background: "#e0e0e0",
  borderRadius: "4px",
};

const progressFill = {
  height: "100%",
  background: "#2c5364",
  borderRadius: "4px",
};
