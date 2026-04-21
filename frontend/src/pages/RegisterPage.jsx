import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/users/register/", form);
      navigate("/login");
    } catch (err) {
      setError("Register basarisiz. Alanlari kontrol et.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page auth-page">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Username
          <input name="username" value={form.username} onChange={onChange} required />
        </label>

        <label>
          First Name
          <input name="first_name" value={form.first_name} onChange={onChange} required />
        </label>

        <label>
          Last Name
          <input name="last_name" value={form.last_name} onChange={onChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Password Again
          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={onChange}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Kayit oluyor..." : "Register"}
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
