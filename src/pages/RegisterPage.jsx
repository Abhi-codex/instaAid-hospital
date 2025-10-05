// src/pages/RegisterPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllHospitals, createStaff } from '../apiService';
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();

    // State for all form fields, including the new 'role'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'staff' // Default role is 'staff'
    });

    const [hospitalSearch, setHospitalSearch] = useState('');
    const [allHospitals, setAllHospitals] = useState([]); // To store the full list from DB
    const [filteredHospitals, setFilteredHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 1. Fetch all hospitals from your database ONCE when the page loads
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await getAllHospitals();
                setAllHospitals(res.data.hospitals || []);
            } catch (err) {
                setError("Could not load hospital list from database.");
                console.error(err);
            }
        };
        fetchHospitals();
    }, []);

    // 2. Filter the local list of hospitals as the user types
    useEffect(() => {
        if (hospitalSearch.length > 0 && !selectedHospital) {
            const filtered = allHospitals.filter(hospital =>
                hospital.name.toLowerCase().includes(hospitalSearch.toLowerCase())
            );
            setFilteredHospitals(filtered);
        } else {
            setFilteredHospitals([]);
        }
    }, [hospitalSearch, allHospitals, selectedHospital]);
    
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleHospitalSelect = (hospital) => {
        setSelectedHospital(hospital);
        setHospitalSearch(hospital.name);
        setFilteredHospitals([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedHospital) {
            setError('You must select a hospital from the search results.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        
        // The full formData (including the role) is sent to the backend
        const finalData = { ...formData, hospitalId: selectedHospital._id };

        try {
            await createStaff(finalData);
            setSuccess('Registration successful! Redirecting to login page...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please check your details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register Hospital Staff</h2>
                
                {error && <div className="message error-message">{error}</div>}
                {success && <div className="message success-message">{success}</div>}

                <div className="form-step">
                    <h3>Step 1: Find Your Hospital</h3>
                    <div className="form-group">
                        <label htmlFor="hospitalSearch">Search your hospital from our database</label>
                        <input
                            type="text"
                            id="hospitalSearch"
                            value={hospitalSearch}
                            onChange={(e) => { setHospitalSearch(e.target.value); setSelectedHospital(null); }}
                            placeholder="Start typing your hospital name..."
                            autoComplete="off"
                        />
                         {filteredHospitals.length > 0 && (
                            <ul className="search-results">
                                {filteredHospitals.map((hospital) => (
                                    <li key={hospital._id} onClick={() => handleHospitalSelect(hospital)}>
                                        {hospital.name} <br />
                                        <small>{hospital.address}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {selectedHospital && ( <div className="selected-hospital"><strong>Selected:</strong> {selectedHospital.name}</div> )}
                    </div>
                </div>

                <div className="form-step">
                    <h3>Step 2: Create Your Account</h3>
                    <p>Password: Uppercase, lowercase, number, and special character required.</p>
                     <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" name="name" id="name" required onChange={handleFormChange} /></div>
                     <div className="form-group"><label htmlFor="email">Email</label><input type="email" name="email" id="email" required onChange={handleFormChange} /></div>
                    <div className="form-group"><label htmlFor="password">Password</label><input type="password" name="password" id="password" required onChange={handleFormChange} /></div>
                    <div className="form-group"><label htmlFor="phone">Phone Number</label><input type="tel" name="phone" id="phone" required onChange={handleFormChange} /></div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select name="role" id="role" value={formData.role} onChange={handleFormChange}>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin (Full Permissions)</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" className="register-button" disabled={loading || !selectedHospital}>
                    {loading ? 'Registering...' : 'Create Account'}
                </button>

                <Link to="/login" className="login-link">Already have an account? Login</Link>
            </form>
        </div>
    );
};

export default RegisterPage;