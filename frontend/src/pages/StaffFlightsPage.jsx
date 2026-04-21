import { useEffect, useState } from "react";
import { api } from "../api/client";

const EMPTY_FORM = {
  flight_number: "",
  operation_airlines: "",
  departure_city: "",
  arrival_city: "",
  date_of_departure: "",
  estimated_time_of_departure: "",
};

function StaffFlightsPage({ onFlightsChanged }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await api.get("/flight/flights/");
      const rows = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setFlights(rows);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.detail || "Flight listesi alinamadi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingFlightId(null);
    setForm(EMPTY_FORM);
  };

  const normalizeError = (payload) => {
    if (!payload) return "Islem basarisiz.";
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
    return "Islem basarisiz.";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      if (editingFlightId) {
        await api.put(`/flight/flights/${editingFlightId}/`, form);
        setSubmitSuccess("Flight basariyla guncellendi.");
      } else {
        await api.post("/flight/flights/", form);
        setSubmitSuccess("Flight basariyla olusturuldu.");
      }
      resetForm();
      await fetchFlights();
      if (onFlightsChanged) {
        await onFlightsChanged();
      }
    } catch (err) {
      setSubmitError(normalizeError(err?.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (flight) => {
    setEditingFlightId(flight.id);
    setForm({
      flight_number: flight.flight_number || "",
      operation_airlines: flight.operation_airlines || "",
      departure_city: flight.departure_city || "",
      arrival_city: flight.arrival_city || "",
      date_of_departure: flight.date_of_departure || "",
      estimated_time_of_departure: flight.estimated_time_of_departure || "",
    });
    setSubmitError("");
    setSubmitSuccess("");
  };

  const onDelete = async (flightId) => {
    const ok = window.confirm("Bu flight silinsin mi?");
    if (!ok) return;

    try {
      await api.delete(`/flight/flights/${flightId}/`);
      if (editingFlightId === flightId) {
        resetForm();
      }
      await fetchFlights();
      if (onFlightsChanged) {
        await onFlightsChanged();
      }
      setSubmitSuccess("Flight silindi.");
    } catch (err) {
      setSubmitError(normalizeError(err?.response?.data));
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Staff Flight Management</h2>
        <p>Bu sayfa sadece staff kullanici icin CRUD islemleri icindir.</p>
      </div>

      <div className="detail-card">
        <h3>{editingFlightId ? "Edit Flight" : "Create Flight"}</h3>
        {submitError && <p className="error">{submitError}</p>}
        {submitSuccess && <p className="success">{submitSuccess}</p>}

        <form className="reservation-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label>
              Flight Number
              <input name="flight_number" value={form.flight_number} onChange={onChange} required />
            </label>

            <label>
              Airline
              <input
                name="operation_airlines"
                value={form.operation_airlines}
                onChange={onChange}
                required
              />
            </label>

            <label>
              Departure City
              <input name="departure_city" value={form.departure_city} onChange={onChange} required />
            </label>

            <label>
              Arrival City
              <input name="arrival_city" value={form.arrival_city} onChange={onChange} required />
            </label>

            <label>
              Departure Date
              <input
                type="date"
                name="date_of_departure"
                value={form.date_of_departure}
                onChange={onChange}
                required
              />
            </label>

            <label>
              Departure Time
              <input
                type="time"
                name="estimated_time_of_departure"
                value={form.estimated_time_of_departure}
                onChange={onChange}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            {editingFlightId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" disabled={submitting}>
              {submitting
                ? editingFlightId
                  ? "Guncelleniyor..."
                  : "Olusturuluyor..."
                : editingFlightId
                  ? "Update Flight"
                  : "Create Flight"}
            </button>
          </div>
        </form>
      </div>

      <div className="detail-card staff-table-card">
        <h3>Flights</h3>
        {loading && (
          <div className="table-wrap skeleton-wrap">
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Flight No</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.id}</td>
                    <td>{flight.flight_number}</td>
                    <td>
                      {flight.departure_city} - {flight.arrival_city}
                    </td>
                    <td>{flight.date_of_departure}</td>
                    <td>{flight.estimated_time_of_departure}</td>
                    <td className="actions-cell">
                      <button type="button" className="secondary-btn" onClick={() => onEdit(flight)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="secondary-btn danger-btn"
                        onClick={() => onDelete(flight.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {flights.length === 0 && <p className="empty-state">Flight bulunamadi.</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default StaffFlightsPage;
