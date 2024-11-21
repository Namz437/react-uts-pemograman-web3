import { useState, useEffect } from "react";
import api from "../../api"; // Pastikan path API Anda benar

export default function PesananIndex() {
  const [pesanan, setPesanan] = useState([]);
  const [diskonOptions, setDiskonOptions] = useState([]);
  const [userId, setUserId] = useState(1); // Simulasi user_id
  const [error, setError] = useState(null);

  const fetchDataPesanan = async () => {
    try {
      const response = await api.get(`/api/pesanan?user_id=${userId}`);
      if (response.data && response.data.data) {
        setPesanan(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching pesanan:", err.message || err);
      setError("Gagal mengambil data pesanan.");
    }
  };

  const fetchDiskonOptions = async () => {
    try {
      const response = await api.get("/api/diskon");
      if (response.data && response.data.data) {
        setDiskonOptions(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching diskon:", err.message || err);
      setError("Gagal mengambil data diskon.");
    }
  };

  useEffect(() => {
    fetchDataPesanan();
    fetchDiskonOptions();
  }, [userId]);

  const handleDiskonChange = (pesananId, diskonId) => {
    const diskon = diskonOptions.find((item) => item.id === Number(diskonId));
    const selectedPesanan = pesanan.find((item) => item.id === pesananId);

    if (diskon && selectedPesanan) {
      const hargaAkhirBaru =
        selectedPesanan.harga_asli -
        (selectedPesanan.harga_asli * diskon.persentase_diskon) / 100;
      setPesanan((prevPesanan) =>
        prevPesanan.map((item) =>
          item.id === pesananId
            ? { ...item, diskon_id: diskonId, harga_akhir: hargaAkhirBaru }
            : item
        )
      );
    }
  };

  const handleSubmit = async (pesananId) => {
    const selectedPesanan = pesanan.find((item) => item.id === pesananId);

    if (!selectedPesanan) return;

    const formData = {
      kontrakan_id: selectedPesanan.kontrakan_id,
      harga_asli: selectedPesanan.harga_asli,
      diskon_id: selectedPesanan.diskon_id,
      harga_akhir: selectedPesanan.harga_akhir,
      status: selectedPesanan.status,
      user_id: userId,
    };

    try {
      const response = await api.put(`/api/pesanan/${pesananId}`, formData);
      alert("Pesanan berhasil diperbarui!");
      fetchDataPesanan();
    } catch (err) {
      console.error("Error memproses pesanan:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px 0",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ fontSize: "2.5rem", color: "#333" }}>
            Pesanan Anda
          </h1>
          <p className="text-muted" style={{ fontSize: "1.2rem" }}>
            Lihat dan segera pesan kontrakan yang Anda inginkan disini.
          </p>
        </div>
        <div className="row">
          {pesanan.length > 0 ? (
            pesanan.map((item) => (
              <div key={item.id} className="col-md-4 col-sm-6 mb-4">
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
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary">
                      Kontrakan ID: {item.kontrakan_id}
                    </h5>
                    <p className="card-text text-muted">
                      <strong>Harga Asli:</strong> {formatRupiah(item.harga_asli)}
                    </p>
                    <p className="card-text text-muted">
                      <strong>Status:</strong> {item.status}
                    </p>
                    <div className="form-group">
                      <label>Diskon</label>
                      <select
                        className="form-control"
                        value={item.diskon_id || ""}
                        onChange={(e) => handleDiskonChange(item.id, e.target.value)}
                        style={{
                          borderRadius: "8px",
                          padding: "8px",
                          border: "1px solid #ced4da",
                        }}
                      >
                        <option value="">Pilih Diskon</option>
                        {diskonOptions.map((diskon) => (
                          <option key={diskon.id} value={diskon.id}>
                            {diskon.kode_diskon} - {diskon.persentase_diskon}%
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="card-text fw-bold text-success mt-3">
                      Harga Akhir: {formatRupiah(item.harga_akhir)}
                    </p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => handleSubmit(item.id)}
                    >
                      Perbarui Pesanan
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-warning text-center">
                Belum ada data pesanan untuk User ID ini.
              </div>
            </div>
          )}
        </div>

        {error && <div className="alert alert-danger mt-4">{error}</div>}
      </div>
    </div>
  );
}
