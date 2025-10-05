import axios from 'axios';

const BASE_URL = 'https://instaaid-backend.onrender.com';
const HOSPITAL_API_URL = `${BASE_URL}/hospitals`; 
const DASHBOARD_API_URL = `${BASE_URL}/hospital-dashboard`;

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hospitalToken');
  if (token) { config.headers.Authorization = `Bearer ${token}`; }
  return config;
}, (error) => Promise.reject(error));

// --- Public Functions ---
export const loginUser = (email, password) => axios.post(`${DASHBOARD_API_URL}/staff/login`, { email, password });
export const createStaff = (staffData) => axios.post(`${DASHBOARD_API_URL}/staff/create`, staffData);
export const getAllHospitals = () => axios.get(HOSPITAL_API_URL);

// --- Authenticated Functions ---
export const getIncomingPatients = () => apiClient.get(`${DASHBOARD_API_URL}/incoming-patients`);
export const getBedAvailability = () => apiClient.get(`${DASHBOARD_API_URL}/bed-availability`);
export const getAmbulanceStatus = () => apiClient.get(`${DASHBOARD_API_URL}/ambulance-status`);
export const getMyInfo = () => apiClient.get(`${DASHBOARD_API_URL}/staff/me`);

// This function sends the updated bed data to the backend
export const updateBedAvailability = (bedData) => {
  return apiClient.put(`${DASHBOARD_API_URL}/bed-availability`, bedData);
};