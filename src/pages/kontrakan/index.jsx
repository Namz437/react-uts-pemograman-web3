import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Pastikan ini diimpor
import api from "../../api";

export default function KontrakanIndex() {
  const [mcpe, setKontrakan] = useState([]);
  const navigate = useNavigate();

  // Fetch data kontrakan
  const fetchDataKontrakan = async () => {
    await api.get("/api/kontrakan").then((response) => {
      setKontrakan(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataKontrakan();
  }, []);

  // Fungsi untuk menangani pemesanan
  const handlePesanSekarang = async (kontrakanId, hargaAsli) => {
    try {
      const payload = {
        kontrakan_id: kontrakanId,
        diskon_id: null,
        user_id: 1,
        harga_asli: hargaAsli,
        harga_akhir: hargaAsli,
        status: "pending",
      };

      // Kirim data ke API
      const response = await api.post("/api/pesanan", payload);

      if (response.status === 201) {
        alert("Pesanan berhasil dibuat!");
        navigate("/pesanan"); // Navigasi ke halaman pesanan
      }
    } catch (error) {
      console.error("Error membuat pesanan:", error.response?.data || error);
      alert("Terjadi kesalahan saat membuat pesanan!");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px 0",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div
          className="text-center mb-5"
          style={{
            color: "#333",
          }}
        >
          <h1 className="fw-bold" style={{ fontSize: "2.5rem" }}>
            Sewa Kontrakan Hj. Minan Cikarang
          </h1>
          <p className="text-muted" style={{ fontSize: "1.2rem" }}>
            Pilih kontrakan terbaik sesuai kebutuhan Anda di Kontrakan Haji Minan Cikarang!
          </p>
        </div>
        <div className="row">
          {mcpe.length > 0 ? (
            mcpe.map((item, index) => (
              <div key={index} className="col-md-4 col-sm-6 mb-4">
                <div
                  className="card h-100 shadow-sm rounded"
                  style={{
                    border: "none",
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={`http://localhost:8000/storage/public/posts/${item.image}`}
                    alt={item.nama}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderBottom: "4px solid #007bff",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary">
                      {item.nama}
                    </h5>
                    <p
                      className="card-text text-muted"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.deskripsi}
                    </p>
                    <p className="card-text text-muted">
                      <strong>Alamat:</strong> {item.alamat}
                    </p>
                    <p className="card-text fw-bold text-success">
                      Harga: Rp {item.harga.toLocaleString("id-ID")}
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => handlePesanSekarang(item.id, item.harga)}
                    >
                      Booking Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-danger text-center">
                Data Kontrakan tidak tersedia!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
