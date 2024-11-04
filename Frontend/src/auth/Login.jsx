import React, { useState } from 'react';
import OpenEyeIcon from "../assets/OpenEyeIcon.png";
import ClosedEyeIcon from "../assets/ClosedEyeIcon.png";
import LoginEmailIcon from "../assets/LoginEmailIcon.png";
import LoginPassIcon from "../assets/LoginPassIcon.png";
import { USER_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Register.css';

const Login = ({ setShowRegister, setUser }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [input, setInput] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message);
        }
    };       

    return (
        <div className='register'>
            <p className='registerHeading'>Login</p>
            <form className='registerForm' onSubmit={loginHandler}>
                <div className='registerInputCon'>
                    <img src={LoginEmailIcon} alt="email" />
                    <input
                        type='email'
                        value={input.email}
                        name='email'
                        onChange={changeEventHandler}
                        placeholder='Email'
                    />
                </div>
                <div className='registerInputCon'>
                    <img src={LoginPassIcon} alt="lock" />
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={input.password}
                        name='password'
                        onChange={changeEventHandler}
                        placeholder='Password'
                    />
                    <img
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        src={isPasswordVisible ? ClosedEyeIcon : OpenEyeIcon} alt="Toggle Password Visibility"
                        className='passwordEye'
                    />
                </div>
                <div className='errorMessageCon'>
                    <p>{errorMessage}</p>
                </div>
                <button type='submit'>Log in</button>
            </form>
            <p className='noAccountPara'>Have no account yet?</p>
            <button onClick={() => setShowRegister(true)}>Register</button>
            <ToastContainer />
        </div>
    )
}

export default Login;