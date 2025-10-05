// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getIncomingPatients, getBedAvailability, getAmbulanceStatus, getMyInfo } from '../apiService';
import SummaryCard from '../components/SummaryCard';
import './DashboardPage.css';

const PriorityBadge = ({ priority }) => {
    const priorityClass = `priority-${priority?.toLowerCase() || 'medium'}`;
    return <span className={`priority ${priorityClass}`}>{priority}</span>;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]); // <-- New state for patient list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only show the main loading message on the very first load
      if (!stats) setLoading(true); 

      try {
        const [patientsRes, bedsRes, ambulancesRes, infoRes] = await Promise.all([
          getIncomingPatients(),
          getBedAvailability(),
          getAmbulanceStatus(),
          getMyInfo()
        ]);
        
        setStats({
          patients: patientsRes.data.count,
          beds: `${bedsRes.data.hospital.availableBeds} / ${bedsRes.data.hospital.totalBeds}`,
          ambulancesFree: ambulancesRes.data.summary.free,
          ambulancesOccupied: ambulancesRes.data.summary.occupied
        });

        setUserInfo(infoRes.data.staff);
        
        // Save the top 5 most recent patients to our new state
        setRecentPatients(patientsRes.data.patients.slice(0, 5));

        setError('');
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []); // Note: dependency array is intentionally empty

  const handleLogout = () => {
    localStorage.removeItem('hospitalToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-message">
          <h1>Hello, <span className="user-name">{userInfo ? userInfo.name : '...'}</span></h1>
          <p>Welcome to the dashboard for <strong className="hospital-name">{userInfo ? userInfo.hospitalId.name : '...'}</strong></p>
        </div>
        <div className="header-buttons">
            <Link to="/my-info" className="header-button my-info-button">My Info</Link>
            <button onClick={handleLogout} className="header-button logout-button">Logout</button>
        </div>
      </header>
      <main>
        
    {loading && <div>Loading Dashboard...</div>}
    {error && <div className="error-message">{error}</div>}
    {stats && (
        <>
        <div className="dashboard-grid">
            <Link to="/incoming-patients" className="dashboard-link">
            <SummaryCard title="Incoming Patients" value={stats.patients} icon="🚑" />
            </Link>
            <Link to="/bed-availability" className="dashboard-link">
            <SummaryCard title="Available Beds" value={stats.beds} icon="🛏️" />
            </Link>
            <Link to="/ambulance-status" className="dashboard-link">
            <SummaryCard title="Ambulances Free" value={stats.ambulancesFree} icon="✅" />
            </Link>
            <Link to="/ambulance-status" className="dashboard-link">
            <SummaryCard title="Ambulances Occupied" value={stats.ambulancesOccupied} icon="🔴" />
            </Link>
        </div>

        <div className="recent-patients-container">
            <h2>Recent Incoming Patients</h2>
            {recentPatients.length > 0 ? (
                <ul className="recent-patients-list">
                    {recentPatients.map(patient => (
                        <li key={patient.rideId} className="patient-item">
                            <div className="patient-item-info">
                                <span className="patient-name">{patient.patient.name}</span>
                                <span className="patient-condition">{patient.condition.description}</span>
                            </div>
                            <div className="patient-item-details">
                                <span className="patient-eta">ETA: {patient.timeToArrival} mins</span>
                                <PriorityBadge priority={patient.condition.priority} />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-recent-patients">No incoming patients at this time.</p>
            )}
        </div>

        {/* --- THIS IS THE NEW GUIDELINES SECTION --- */}
        <div className="guidelines-container">
            <h2>Daily Checklist</h2>
            <ul className="guidelines-list">
                <li className="guideline-item">
                    <span className="guideline-icon">🛏️</span>
                    <p>Remember to **update bed availability** regularly, especially after a patient is admitted or discharged.</p>
                </li>
                <li className="guideline-item">
                    <span className="guideline-icon">📞</span>
                    <p>For critical incoming patients, use the 'Incoming Patients' page to get **driver and relative contact** information.</p>
                </li>
                <li className="guideline-item">
                    <span className="guideline-icon">🚑</span>
                    <p>Check the **Ambulance Status** page to see which units are free for new emergencies in your area.</p>
                </li>
            </ul>
        </div>
        {/* --- END OF NEW SECTION --- */}
        </>
    )}

      </main>
    </div>
  );
};

export default DashboardPage;