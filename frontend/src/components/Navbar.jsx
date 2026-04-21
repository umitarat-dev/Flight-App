import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout, isMenuOpen, setIsMenuOpen }) {
  const menuContainerRef = useRef(null);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onDocumentClick = (event) => {
      if (!menuContainerRef.current) return;
      if (!menuContainerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-logo">UF</span>
      </Link>

      <h1 className="brand-title">Umitdev Flight Reservation</h1>

      <div className="auth-menu" ref={menuContainerRef}>
        <button
          type="button"
          className="auth-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          Auth
        </button>

        {isMenuOpen && (
          <div className="auth-dropdown">
            {!user && (
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            )}
            {!user && (
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            )}
            {user && (
              <Link to="/my-reservations" onClick={closeMenu}>
                My Reservations
              </Link>
            )}
            {user?.is_staff && (
              <Link to="/staff/reservations" onClick={closeMenu}>
                All Reservations
              </Link>
            )}
            {user && (
              <Link to="/profile" onClick={closeMenu}>
                Profile
              </Link>
            )}
            {user?.is_staff && (
              <Link to="/staff/flights" onClick={closeMenu}>
                Staff Panel
              </Link>
            )}
            {user && (
              <button type="button" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
