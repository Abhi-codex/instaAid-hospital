import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyInfo } from '../apiService';
import './MyInfoPage.css';

const InfoPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await getMyInfo();
                setUserInfo(res.data.staff);
            } catch (err) {
                setError('Failed to fetch user information.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    return (
        <div className="info-page-container">
            <header className="info-header">
                <h1>My Information</h1>
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            </header>
            <main>
                {loading && <div>Loading information...</div>}
                {error && <div className="error-message">{error}</div>}
                {userInfo && (
                    <div className="info-card">
                        <div className="info-section">
                            <h2>Account Details</h2>
                            <p><strong>Name:</strong> {userInfo.name}</p>
                            <p><strong>Email:</strong> {userInfo.email}</p>
                            <p><strong>Phone:</strong> {userInfo.phone}</p>
                            <p><strong>Role:</strong> {userInfo.role}</p>
                            <p><strong>Department:</strong> {userInfo.department}</p>
                        </div>
                        <div className="info-section">
                            <h2>Hospital Details</h2>
                            <p><strong>Hospital Name:</strong> {userInfo.hospitalId.name}</p>
                            <p><strong>Address:</strong> {userInfo.hospitalId.address}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InfoPage;