import { useState } from "react";
import { api } from "../api/client";

function ProfilePage({ user }) {
  const [form, setForm] = useState({
    old_password: "",
    new_password1: "",
    new_password2: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeError = (payload) => {
    if (!payload) return "Sifre degistirilemedi.";
    if (typeof payload === "string") return payload;
    if (Array.isArray(payload)) return payload.join(" ");
    if (typeof payload === "object") {
      return Object.entries(payload)
        .map(([key, value]) => {
          const text = Array.isArray(value) ? value.join(" ") : String(value);
          return `${key}: ${text}`;
        })
        .join(" | ");
    }
    return "Sifre degistirilemedi.";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/users/auth/password/change/", form);
      setSuccess("Sifre basariyla degistirildi.");
      setForm({ old_password: "", new_password1: "", new_password2: "" });
    } catch (err) {
      setError(normalizeError(err?.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        <p>Auth bilgileriniz ve sifre degistirme alani.</p>
      </div>

      <div className="detail-card">
        <h3>User Info</h3>
        <div className="profile-grid">
          <p>
            <strong>ID:</strong> {user?.id}
          </p>
          <p>
            <strong>Username:</strong> {user?.username || "-"}
          </p>
          <p>
            <strong>Name:</strong> {user?.first_name} {user?.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.is_staff ? "Staff" : "User"}
          </p>
        </div>
      </div>

      <div className="detail-card">
        <h3>Password Change</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Old Password
            <input
              type="password"
              name="old_password"
              value={form.old_password}
              onChange={onChange}
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              name="new_password1"
              value={form.new_password1}
              onChange={onChange}
              required
            />
          </label>

          <label>
            New Password Again
            <input
              type="password"
              name="new_password2"
              value={form.new_password2}
              onChange={onChange}
              required
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Guncelleniyor..." : "Change Password"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
