import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';

import Ranglisten from './components/Ranglisten';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Statistik from './components/Statistik';
import Ergebnisse from './components/Ergebnisse';
import Profil from './components/Profil';
import Admin from './components/Admin';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Layout für eingeloggte Portal-Bereiche
function PortalLayout() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ranglisten />} />
        <Route path="/portal" element={<Login />} />

        {/* Geschützte Portalbereiche */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PortalLayout />}>
            <Route path="/portal/dashboard" element={<Dashboard />} />
            <Route path="/portal/statistik" element={<Statistik />} />
            <Route path="/portal/ergebnisse" element={<Ergebnisse />} />
            <Route path="/portal/profil" element={<Profil />} />
            <Route path="/portal/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
