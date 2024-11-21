import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get("http://localhost:8000/api/user");
      setUser(response.data);
      localStorage.setItem("userName", response.data.name); // Save user's name in localStorage
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch user data");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [token, navigate]);

  const logoutHandler = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post("http://localhost:8000/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userName"); // Clear user name
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-body">
              <h5>Welcome, <strong>{user.name}</strong>!</h5>
              <hr />
              <button onClick={logoutHandler} className="btn btn-md btn-danger">
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
