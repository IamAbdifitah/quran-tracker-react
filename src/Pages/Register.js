import { supabase } from "../supabase";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target;

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) {
      setError(error.message);
      return;
    }

    await supabase.from("users").insert({
      id: data.user.id,
      name: name.value,
      email: email.value,
    });

    alert("Registered successfully");
    window.location.href = "/login";
  };

 return (
  <div className="auth-wrapper">
    <div className="form-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" required />
        <input name="email" type="email" required />
        <input name="password" type="password" required />
        <button>Register</button>
      </form>

      {error && <p className="error">{error}</p>}
      <Link to="/login">Already have account?</Link>
    </div>
  </div>
);
}