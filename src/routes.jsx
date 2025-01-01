import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ForgotPass from './Login/ForgotPass';
import ResetPass from './Login/ResetPass';
import Verify from './Login/Verify';
import TopBar from './Main/TopBar';
import { BiLoaderCircle } from 'react-icons/bi';
import Loader from './Login/Loader';
import Home from './Main/Home';
import Academy from './pages/Academy';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Ground from './pages/Ground';
import ManagerDashboard from './Manager/ManagerDashboard';
import CryptoJS from 'crypto-js';

const AppRoutes = ({ setLoading }) => {
  // const email = localStorage.getItem('email');
    // const token = localStorage.getItem('token');
    // const role = CryptoJS.AES.decrypt(localStorage.getItem('role'),import.meta.env.VITE_ENC_KEY).toString(CryptoJS.enc.Utf8);
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot" element={<ForgotPass />} />
      <Route path="/resetpass" element={<ResetPass />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/loading" element={<Loader />} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/academy" element={<Academy />} />
      <Route path='/contactus' element={<ContactUs />} />
      <Route path='/aboutus' element={<AboutUs />} />
      <Route path='/gallery' element={<Gallery />} />
      <Route path='/playground' element={<Ground />} />
      <Route path="/manager" element={<ManagerDashboard/> } />
    </Routes>
  );
};

export default AppRoutes;
