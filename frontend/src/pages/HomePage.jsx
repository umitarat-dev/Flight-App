import { Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../api/client";

function HomePage({ flights, loading, error, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengersForm, setPassengersForm] = useState([
    { first_name: "", last_name: "", email: "", phone_number: "" },
  ]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const roleText = !user
    ? "Anonymous user: sadece uygun/guncel ucuslar listelenir."
    : user.is_staff
      ? "Staff user: tum ucuslar listelenir."
      : "Authenticated user: token ile listeleme aktif.";

  const openReservationModal = (flight) => {
    setSelectedFlight(flight);
    setPassengersForm([{ first_name: "", last_name: "", email: "", phone_number: "" }]);
    setSubmitError("");
    setSubmitSuccess("");
    setIsModalOpen(true);
  };

  const closeReservationModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(false);
  };

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

  const normalizeError = (payload) => {
    if (!payload) return "Reservation olusturulamadi.";
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
    return "Reservation olusturulamadi.";
  };

  const onCreateReservation = async (event) => {
    event.preventDefault();
    if (!selectedFlight) return;

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await api.post("/flight/reservations/", {
        flight_id: Number(selectedFlight.id),
        passenger: passengersForm.map((passenger) => ({
          ...passenger,
          phone_number: String(passenger.phone_number).trim(),
        })),
      });
      setSubmitSuccess("Reservation basariyla olusturuldu.");
      setPassengersForm([{ first_name: "", last_name: "", email: "", phone_number: "" }]);
    } catch (err) {
      setSubmitError(normalizeError(err?.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page">
        <div className="page-header">
          <h2>Flights</h2>
          <p className="muted">{roleText}</p>
          {user && (
            <p className="muted">
              Reservation icin istedigin ucusta <strong>Reserve</strong> butonunu kullan.
            </p>
          )}
        </div>

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
                  <th>Flight No</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.flight_number}</td>
                    <td>{flight.operation_airlines}</td>
                    <td>
                      {flight.departure_city} - {flight.arrival_city}
                    </td>
                    <td>{flight.date_of_departure}</td>
                    <td>{flight.estimated_time_of_departure}</td>
                    <td>
                      <Link to={`/flights/${flight.id}`} className="link-btn">
                        Details
                      </Link>
                      {user && (
                        <button
                          type="button"
                          className="secondary-btn reserve-inline-btn"
                          onClick={() => openReservationModal(flight)}
                        >
                          Reserve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {flights.length === 0 && <p className="empty-state">Kayit bulunamadi.</p>}
          </div>
        )}
      </section>

      {isModalOpen && selectedFlight && (
        <div className="modal-backdrop" onClick={closeReservationModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Reserve: {selectedFlight.flight_number} ({selectedFlight.departure_city} -{" "}
                {selectedFlight.arrival_city})
              </h3>
              <button type="button" className="secondary-btn" onClick={closeReservationModal}>
                Close
              </button>
            </div>

            {submitError && <p className="error">{submitError}</p>}
            {submitSuccess && <p className="success">{submitSuccess}</p>}

            <form className="reservation-form" onSubmit={onCreateReservation}>
              <div className="passenger-top">
                <p className="passenger-count">
                  Yolcu sayisi: <strong>{passengersForm.length}</strong>
                </p>
                <button type="button" className="secondary-btn" onClick={addPassenger}>
                  + Add Passenger
                </button>
              </div>

              {passengersForm.map((passenger, index) => (
                <div key={`modal-passenger-${index}`} className="passenger-card">
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
                <button type="submit" disabled={submitting}>
                  {submitting ? "Olusturuluyor..." : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
