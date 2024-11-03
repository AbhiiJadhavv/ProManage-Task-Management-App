import React, { useState } from 'react';
import OpenEyeIcon from "../assets/OpenEyeIcon.png";
import ClosedEyeIcon from "../assets/ClosedEyeIcon.png";
import LoginNameIcon from "../assets/LoginNameIcon.png";
import LoginEmailIcon from "../assets/LoginEmailIcon.png";
import LoginPassIcon from "../assets/LoginPassIcon.png";
import axios from "axios";
import '../styles/Settings.css';
import { toast } from 'react-toastify';
import { USER_API_END_POINT } from '../utils/constant';
import { logoutUser } from '../utils/logout';
import { useNavigate } from 'react-router-dom';

const Settings = ({ setUser }) => {
    const [isPassword1Visible, setIsPassword1Visible] = useState(false);
    const [isPassword2Visible, setIsPassword2Visible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [input, setInput] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
    });
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, input, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                console.log("Profile Updated Successfully.");
                logoutUser(setUser, navigate);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error?.response?.data?.message || "An error occurred");
        }
    };
    
    return (
        <div className='settings'>
            <p>Settings</p>
            <form className='registerForm' onSubmit={updateHandler}>
                <div className='registerInputCon'>
                    <img src={LoginNameIcon} alt="name" />
                    <input
                        type='text'
                        value={input.name}
                        name='name'
                        onChange={changeEventHandler}
                        placeholder='Name'
                    />
                </div>
                <div className='registerInputCon'>
                    <img src={LoginEmailIcon} alt="email" />
                    <input
                        type='email'
                        value={input.email}
                        name='email'
                        onChange={changeEventHandler}
                        placeholder='Update Email'
                    />
                </div>
                <div className='registerInputCon'>
                    <img src={LoginPassIcon} alt="lock" />
                    <input
                        type={isPassword1Visible ? 'text' : 'password'}
                        value={input.oldPassword}
                        name='oldPassword'
                        onChange={changeEventHandler}
                        placeholder='Old Password'
                    />
                    <img
                        onClick={() => setIsPassword1Visible(!isPassword1Visible)}
                        src={isPassword1Visible ? ClosedEyeIcon : OpenEyeIcon} alt="Toggle Password Visibility"
                        className='passwordEye'
                    />
                </div>
                <div className='registerInputCon'>
                    <img src={LoginPassIcon} alt="lock" />
                    <input
                        type={isPassword2Visible ? 'text' : 'password'}
                        value={input.newPassword}
                        name='newPassword'
                        onChange={changeEventHandler}
                        placeholder='New Password'
                    />
                    <img
                        onClick={() => setIsPassword2Visible(!isPassword2Visible)}
                        src={isPassword2Visible ? ClosedEyeIcon : OpenEyeIcon} alt="Toggle Password Visibility"
                        className='passwordEye'
                    />
                </div>
                <div className='errorMessageCon'>
                    <p>{errorMessage}</p>
                </div>
                <button type='submit'>Update</button>
            </form>
        </div>
    )
}

export default Settings;