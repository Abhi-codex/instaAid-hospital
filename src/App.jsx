// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IncomingPatientsPage from './pages/IncomingPatientsPage';
import MyInfoPage from './pages/MyInfoPage';
import BedAvailabilityPage from './pages/BedAvailabilityPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('hospitalToken');
  if (!token) { return <Navigate to="/login" />; }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/incoming-patients" element={<ProtectedRoute><IncomingPatientsPage /></ProtectedRoute>} />
        <Route path="/my-info" element={<ProtectedRoute><MyInfoPage /></ProtectedRoute>} />
        <Route path="/bed-availability" element={<ProtectedRoute><BedAvailabilityPage /></ProtectedRoute>} />
        
        {/* The route for AmbulanceStatusPage has been removed for now */}

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
export default App;