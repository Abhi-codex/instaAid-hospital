// src/components/PatientCard.jsx
import React from 'react';
import './PatientCard.css'; // Import the new CSS file

const PatientCard = ({ patient }) => {
  const priority = patient.condition.priority?.toLowerCase() || 'medium';

  return (
    <div className={`patient-card priority-border-${priority}`}>
      <div className="card-main-info">
        <div className="patient-details">
          <div className="name">{patient.patient.name}</div>
          <div className="status">{patient.status.replace(/_/g, ' ')}</div>
        </div>
        <div className="eta-details">
          <div className="value">{patient.timeToArrival}</div>
          <div className="label">min ETA</div>
        </div>
      </div>

      <div className="card-grid-info">
        <div className="info-block">
          <div className="info-icon">👤</div>
          <div className="info-text-group">
            <div className="info-label">Patient Contact</div>
            <div className="info-value">{patient.patient.phone}</div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-icon">❤️</div>
          <div className="info-text-group">
            <div className="info-label">Condition</div>
            <div className="info-value">{patient.condition.description}</div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-icon">👨‍⚕️</div>
          <div className="info-text-group">
            <div className="info-label">Driver</div>
            <div className="info-value">{patient.ambulance.driver?.name || 'N/A'}</div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-icon">📞</div>
          <div className="info-text-group">
            <div className="info-label">Driver Contact</div>
            <div className="info-value">
              {patient.ambulance.driver?.phone ? (
                <a href={`tel:${patient.ambulance.driver.phone}`}>{patient.ambulance.driver.phone}</a>
              ) : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="ride-time">
          Created: {new Date(patient.createdAt).toLocaleTimeString()}
        </div>
        {patient.ambulance.currentLocation?.latitude ? (
            <a 
                href={`http://googleusercontent.com/maps.google.com/?q=${patient.ambulance.currentLocation.latitude},${patient.ambulance.currentLocation.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-link-button"
            >
                Track on Map
            </a>
        ) : <span className="map-link-disabled">No Location</span>}
      </div>
    </div>
  );
};

export default PatientCard;