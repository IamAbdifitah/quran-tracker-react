import { useState } from "react";
import { getUsers, saveUsers } from "../utils/storage";
import { Link } from "react-router-dom";
import "../styles/form.css";

export default function Register() {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = e.target;
    const users = getUsers();

    if (users.find(u => u.email === email.value)) {
      setError("Email already exists");
      return;
    }

    users.push({
      name: name.value,
      email: email.value,
      password: password.value
    });

    saveUsers(users);
    alert("Registered successfully");
    e.target.reset();
  };

  return (
    <div className="auth-wrapper">
    <div className="form-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />

        <button>Register</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="link">
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
    </div>
  );
}
