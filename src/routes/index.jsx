import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Dashboard.jsx';
import KontrakanIndex from '../pages/kontrakan/index.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/register.jsx';
import PesananIndex from "../pages/pesanan/index.jsx";

function RoutesIndex() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/kontrakan" element={<KontrakanIndex />} />
      <Route path="/pesanan" element={<PesananIndex />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default RoutesIndex;
