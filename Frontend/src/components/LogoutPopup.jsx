import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { USER_API_END_POINT } from '../utils/constant';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import '../styles/LogoutPopup.css';
import { useNavigate } from 'react-router-dom';

const LogoutPopup = ({ setShowLogout, setUser }) => {
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });

            if (res.data.success) {
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate("/");
                toast.success(res.data.message);
                console.log("Logged out successfully.");
                setShowLogout(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

  return (
    <div className='logoutPopupCon'>
        <div className='logoutPopup'>
            <p>Are you sure you want to Logout?</p>
            <button className='logoutPopupBtn' onClick={logoutHandler}>Yes, Logout</button>
            <button className='hideLogoutBtn' onClick={() => setShowLogout(false)}>Cancel</button>
        </div>
        <ToastContainer />
    </div>
  )
}

export default LogoutPopup;