import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api, authStorage } from "./api/client";
import Navbar from "./components/Navbar";
import FlightDetailPage from "./pages/FlightDetailPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import StaffFlightsPage from "./pages/StaffFlightsPage";

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchFlights = async () => {
    try {
      const response = await api.get("/flight/flights/");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setFlights(data);
      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Backend API'ye baglanilamadi. Backend'in calistigini kontrol et."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    if (!authStorage.getToken()) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get("/users/auth/user/");
      setUser(response.data);
    } catch (_) {
      authStorage.clearToken();
      setUser(null);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      await fetchCurrentUser();
      await fetchFlights();
    };
    bootstrap();
  }, []);

  const onLogin = async (data) => {
    if (data?.key) {
      authStorage.setToken(data.key);
    }
    if (data?.user) {
      setUser(data.user);
    } else {
      await fetchCurrentUser();
    }
    await fetchFlights();
    setIsMenuOpen(false);
  };

  const onLogout = async () => {
    try {
      await api.post("/users/auth/logout/");
    } catch (_) {
      // Logout endpoint fail etse bile local token temizlenmeli.
    }
    authStorage.clearToken();
    setUser(null);
    setIsMenuOpen(false);
    await fetchFlights();
  };

  return (
    <>
      <Navbar
        user={user}
        onLogout={onLogout}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage flights={flights} loading={loading} error={error} user={user} />}
        />
        <Route path="/flights/:id" element={<FlightDetailPage user={user} />} />
        <Route
          path="/my-reservations"
          element={
            user ? <MyReservationsPage isStaffView={false} user={user} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/staff/reservations"
          element={
            user?.is_staff ? (
              <MyReservationsPage isStaffView={true} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/staff/flights"
          element={
            user?.is_staff ? (
              <StaffFlightsPage onFlightsChanged={fetchFlights} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
