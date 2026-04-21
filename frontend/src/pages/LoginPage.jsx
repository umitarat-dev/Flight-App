import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
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
      const response = await api.post("/users/auth/login/", form);
      onLogin(response.data);
      navigate("/");
    } catch (err) {
      setError("Login basarisiz. Kullanici bilgilerini kontrol et.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page auth-page">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            required
          />
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

        <button type="submit" disabled={submitting}>
          {submitting ? "Giris yapiliyor..." : "Login"}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
