// src/pages/IncomingPatientsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getIncomingPatients } from '../apiService';
import PatientCard from '../components/PatientCard';
import './IncomingPatientsPage.css';
import '../components/PatientCard.css'; // <-- THIS IS THE NEW TEST LINE

const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

const IncomingPatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('priority');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getIncomingPatients();
                setPatients(res.data.patients);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
        
    }, []);

    const sortedPatients = useMemo(() => {
        if (!patients) return [];
        return [...patients].sort((a, b) => {
            switch (sortBy) {
                case 'eta':
                    return a.timeToArrival - b.timeToArrival;
                case 'time':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'priority':
                default:
                    const priorityA = priorityOrder[a.condition.priority] || 0;
                    const priorityB = priorityOrder[b.condition.priority] || 0;
                    return priorityB - priorityA;
            }
        });
    }, [patients, sortBy]);

    return (
        <div className="patients-container">
            <header className="patients-header">
                <h1>Incoming Patients</h1>
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            </header>
            <div className="controls-bar">
                <label htmlFor="sort-by">Sort By:</label>
                <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="priority">Priority (Critical First)</option>
                    <option value="eta">ETA (Closest First)</option>
                    <option value="time">Time (Newest First)</option>
                </select>
            </div>
            <main>
                {loading && <div>Loading patients...</div>}
                {error && <div className="error-message">{error}</div>}
                {!loading && !error && (
                    <div className="patients-grid">
                        {sortedPatients.length > 0 ? (
                            sortedPatients.map(p => <PatientCard key={p.rideId} patient={p} />)
                        ) : (
                            <div className="no-patients-message">No incoming patients at this time.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default IncomingPatientsPage;