import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

function MyReservationsPage({ isStaffView = false, user }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get(
          isStaffView ? "/flight/reservations/" : "/flight/reservations/?mine=1"
        );
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];
        setRows(data);
        setError("");
      } catch (err) {
        setError(err?.response?.data?.detail || "Reservation listesi alinamadi.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isStaffView]);

  return (
    <section className="page">
      <div className="page-header">
        <h2>{isStaffView ? "All Reservations (Staff)" : "My Reservations"}</h2>
        <p>
          {isStaffView
            ? "Staff gorunumu: tum reservation kayitlari listelenir."
            : "Kendi reservation kayitlarin burada listelenir."}
        </p>
      </div>

      {loading && (
        <div className="table-wrap skeleton-wrap">
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
                <th>Reservation ID</th>
                <th>Flight</th>
                <th>Passengers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((res) => (
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{res.flight || "-"}</td>
                  <td>
                    {(res.passenger || [])
                      .map((pas) => `${pas.first_name} ${pas.last_name}`)
                      .join(", ") || "-"}
                  </td>
                  <td>
                    <Link to={`/flights/${res.flight_id}`} className="link-btn">
                      Go to Flight
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="empty-state">Reservation bulunamadi.</p>}
        </div>
      )}
    </section>
  );
}

export default MyReservationsPage;
