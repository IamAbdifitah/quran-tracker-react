import { useState } from "react";
import { getUsers, setCurrentUser } from "../utils/storage";
import { Link } from "react-router-dom";
import "../styles/form.css";

export default function Login() {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = e.target;

    /* ================= ADMIN LOGIN ================= */
    if (
      email.value === "admin@email.com" &&
      password.value === "admin123"
    ) {
      localStorage.setItem(
        "currentAdmin",
        JSON.stringify({ email: email.value })
      );
      window.location.href = "/Admin";
      return;
    }

    /* ================= USER LOGIN ================= */
    const users = getUsers();

    const user = users.find(
      (u) =>
        u.email === email.value &&
        u.password === password.value
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setCurrentUser(user);
    window.location.href = "/dashboard";
  };

  return (
    <div className="auth-wrapper">
      <div className="form-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="link">
          <Link to="/register">
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}