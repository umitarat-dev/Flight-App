import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

function FlightDetailPage({ user }) {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [passengersForm, setPassengersForm] = useState([
    { first_name: "", last_name: "", email: "", phone_number: "" },
  ]);

  const fetchReservations = async () => {
    const resResp = await api.get("/flight/reservations/");
    const rows = Array.isArray(resResp.data) ? resResp.data : resResp.data?.results || [];
    setReservations(rows);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const flightResp = await api.get(`/flight/flights/${id}/`);
        setFlight(flightResp.data);

        if (user) {
          await fetchReservations();
        }
      } catch (err) {
        setError(err?.response?.data?.detail || "Flight detail alinamadi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  const reservationRows = useMemo(() => {
    if (!flight) return [];
    return reservations.filter((item) => Number(item.flight_id) === Number(flight.id));
  }, [flight, reservations]);

  const onPassengerChange = (index, event) => {
    const { name, value } = event.target;
    setPassengersForm((prev) =>
      prev.map((passenger, idx) =>
        idx === index ? { ...passenger, [name]: value } : passenger
      )
    );
  };

  const addPassenger = () => {
    setPassengersForm((prev) => [
      ...prev,
      { first_name: "", last_name: "", email: "", phone_number: "" },
    ]);
  };

  const removePassenger = (index) => {
    setPassengersForm((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onCreateReservation = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const payload = {
        flight_id: Number(id),
        passenger: passengersForm.map((passenger) => ({
          ...passenger,
          phone_number: String(passenger.phone_number).trim(),
        })),
      };

      if (editingReservationId) {
        await api.put(`/flight/reservations/${editingReservationId}/`, payload);
        setSubmitSuccess("Reservation basariyla guncellendi.");
      } else {
        await api.post("/flight/reservations/", payload);
        setSubmitSuccess("Reservation basariyla olusturuldu.");
      }

      setPassengersForm([{ first_name: "", last_name: "", email: "", phone_number: "" }]);
      setEditingReservationId(null);
      await fetchReservations();
    } catch (err) {
      setSubmitError(err?.response?.data?.detail || "Reservation olusturulamadi.");
    } finally {
      setSubmitting(false);
    }
  };

  const onEditReservation = (reservation) => {
    const passengers = (reservation.passenger || []).map((pas) => ({
      first_name: pas.first_name || "",
      last_name: pas.last_name || "",
      email: pas.email || "",
      phone_number: String(pas.phone_number || ""),
    }));
    setPassengersForm(
      passengers.length > 0
        ? passengers
        : [{ first_name: "", last_name: "", email: "", phone_number: "" }]
    );
    setEditingReservationId(reservation.id);
    setSubmitError("");
    setSubmitSuccess("");
  };

  const onCancelEdit = () => {
    setEditingReservationId(null);
    setPassengersForm([{ first_name: "", last_name: "", email: "", phone_number: "" }]);
    setSubmitError("");
    setSubmitSuccess("");
  };

  const onDeleteReservation = async (reservationId) => {
    const ok = window.confirm("Bu reservation silinsin mi?");
    if (!ok) return;

    try {
      await api.delete(`/flight/reservations/${reservationId}/`);
      if (editingReservationId === reservationId) {
        onCancelEdit();
      }
      await fetchReservations();
      setSubmitSuccess("Reservation silindi.");
    } catch (err) {
      setSubmitError(err?.response?.data?.detail || "Reservation silinemedi.");
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p>Yukleniyor...</p>
      </section>
    );
  }

  if (error || !flight) {
    return (
      <section className="page">
        <p className="error">{error || "Flight bulunamadi."}</p>
        <Link to="/" className="link-btn">
          Home
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>
          {flight.flight_number} - {flight.departure_city} / {flight.arrival_city}
        </h2>
        <p>
          {flight.operation_airlines} | {flight.date_of_departure} |{" "}
          {flight.estimated_time_of_departure}
        </p>
      </div>

      <div className="detail-card">
        <h3>Reservation Details</h3>
        {!user && <p>Reservation detaylari icin login olmalisin.</p>}
        {user && reservationRows.length === 0 && <p>Bu ucus icin reservation bulunamadi.</p>}

        {user && reservationRows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>User</th>
                  <th>Passengers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservationRows.map((res) => (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{res.user || "-"}</td>
                    <td>
                      {(res.passenger || [])
                        .map((pas) => `${pas.first_name} ${pas.last_name}`)
                        .join(", ") || "-"}
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => onEditReservation(res)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="secondary-btn danger-btn"
                        onClick={() => onDeleteReservation(res.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {user && (
          <form className="reservation-form" onSubmit={onCreateReservation}>
            <h4>{editingReservationId ? "Edit Reservation" : "Create Reservation"}</h4>
            {submitError && <p className="error">{submitError}</p>}
            {submitSuccess && <p className="success">{submitSuccess}</p>}

            <div className="passenger-top">
              <p className="passenger-count">
                Yolcu sayisi: <strong>{passengersForm.length}</strong>
              </p>
              <button type="button" className="secondary-btn" onClick={addPassenger}>
                + Add Passenger
              </button>
            </div>

            {passengersForm.map((passenger, index) => (
              <div key={`passenger-${index}`} className="passenger-card">
                <div className="passenger-card-header">
                  <h5>Passenger {index + 1}</h5>
                  {passengersForm.length > 1 && (
                    <button
                      type="button"
                      className="secondary-btn danger-btn"
                      onClick={() => removePassenger(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <label>
                    First Name
                    <input
                      name="first_name"
                      value={passenger.first_name}
                      onChange={(event) => onPassengerChange(index, event)}
                      required
                    />
                  </label>

                  <label>
                    Last Name
                    <input
                      name="last_name"
                      value={passenger.last_name}
                      onChange={(event) => onPassengerChange(index, event)}
                      required
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={passenger.email}
                      onChange={(event) => onPassengerChange(index, event)}
                      required
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      type="tel"
                      name="phone_number"
                      value={passenger.phone_number}
                      onChange={(event) => onPassengerChange(index, event)}
                      required
                    />
                  </label>
                </div>
              </div>
            ))}

            <div className="form-actions">
              {editingReservationId && (
                <button type="button" className="secondary-btn" onClick={onCancelEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" disabled={submitting}>
                {submitting
                  ? editingReservationId
                    ? "Guncelleniyor..."
                    : "Olusturuluyor..."
                  : editingReservationId
                    ? "Update Reservation"
                    : "Create Reservation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default FlightDetailPage;
