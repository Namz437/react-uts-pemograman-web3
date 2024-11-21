import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Routes from "./routes";
import axios from "axios";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName"); // Fetch user's name

  const logoutHandler = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post("http://localhost:8000/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showNavbar && (
        <div>
          <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container">
              <Link to="/dashboard" className="navbar-brand">
                Homepage
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link to="/kontrakan" className="nav-link active">
                      Kontrakan
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/pesanan" className="nav-link active">
                      Pesanan
                    </Link>
                  </li>
                </ul>
                <span className="text-light me-2">{userName}</span>
                <button
                  onClick={logoutHandler}
                  className="btn btn-danger btn-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
      <Routes />
    </>
  );
}
