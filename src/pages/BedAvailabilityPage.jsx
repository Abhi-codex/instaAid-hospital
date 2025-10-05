// src/pages/BedAvailabilityPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBedAvailability, updateBedAvailability } from '../apiService';
import './BedAvailabilityPage.css';

const BedAvailabilityPage = () => {
    const [bedData, setBedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    const fetchBedData = async () => {
        setLoading(true);
        try {
            const res = await getBedAvailability();
            setBedData(res.data.hospital);
            if (res.data.hospital && res.data.hospital.bedDetails) {
                setFormData(res.data.hospital.bedDetails);
            }
            setError('');
        } catch (err) {
            setError('Failed to fetch bed availability.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBedData();
    }, []);

    const handleInputChange = (dept, type, value) => {
        // If the input is cleared, its value becomes an empty string ''.
        // We convert it to the number 0 for our state.
        const numericValue = parseInt(value, 10) || 0;
        setFormData(prev => ({
            ...prev,
            [dept]: { ...prev[dept], [type]: numericValue }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await updateBedAvailability({ bedDetails: formData });
            setBedData(res.data.hospital);
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError('Failed to update bed availability.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(bedData.bedDetails);
        setIsEditing(false);
    };

    if (loading && !bedData) return <div style={{padding: '2rem'}}>Loading Bed Availability...</div>;
    if (error && !bedData) return <div className="error-message" style={{margin: '2rem'}}>{error}</div>;
    if (!bedData) return null;

    return (
        <div className="bed-availability-container">
            <header className="bed-availability-header">
                <h1>Bed Availability</h1>
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            </header>
            <main>
                <div className="bed-card">
                    <div className="bed-card-header">
                        <h2>{bedData.name}</h2>
                        {!isEditing ? (
                            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                        ) : (
                            <div className="form-buttons">
                                <button className="save-button" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                            </div>
                        )}
                    </div>
                    {error && <div className="error-message" style={{marginBottom: '1rem'}}>{error}</div>}
                    <div className="bed-type-grid">
                        {Object.entries(formData).map(([dept, data]) => (
                            <div className="bed-type" key={dept}>
                                <h3>{dept}</h3>
                                {isEditing ? (
                                    <div className="bed-inputs">
                                        <div className="form-group">
                                            <label>Available Beds</label>
                                            {/* THE FIX IS HERE: `|| ''` makes the input empty if the value is 0 */}
                                            <input type="number" value={data.available || ''} onChange={e => handleInputChange(dept, 'available', e.target.value)} placeholder="0" />
                                        </div>
                                        <div className="form-group">
                                            <label>Total Beds</label>
                                            {/* THE FIX IS HERE: `|| ''` also on this input */}
                                            <input type="number" value={data.total || ''} onChange={e => handleInputChange(dept, 'total', e.target.value)} placeholder="0" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bed-counts">
                                        <p>Available: <strong>{bedData.bedDetails[dept].available}</strong></p>
                                        <p>Total: <strong>{bedData.bedDetails[dept].total}</strong></p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BedAvailabilityPage;