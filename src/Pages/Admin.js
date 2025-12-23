import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import "../styles/admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data: usersData } = await supabase
      .from("users")
      .select("id, name, email");

    if (!usersData) return;

    const usersWithProgress = await Promise.all(
      usersData.map(async (u) => {
        const { data: progress } = await supabase
          .from("progress")
          .select("juz")
          .eq("user_id", u.id)
          .eq("completed", true);

        const completed = progress ? progress.length : 0;
        const percent = Math.round((completed / 30) * 100);

        return { ...u, completed, percent };
      })
    );

    setUsers(usersWithProgress);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard">
        <h2>Admin Panel</h2>
        <p className="subtitle">Qur'an Reading Progress</p>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Juz Read</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><strong>{u.completed}/30</strong></td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${u.percent}%` }}
                    />
                  </div>
                  <small>{u.percent}%</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}