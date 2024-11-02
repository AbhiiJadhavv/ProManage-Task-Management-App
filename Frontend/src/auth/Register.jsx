import React, { useState } from 'react'
import OpenEyeIcon from "../assets/OpenEyeIcon.png";
import ClosedEyeIcon from "../assets/ClosedEyeIcon.png";
import LoginNameIcon from "../assets/LoginNameIcon.png";
import LoginEmailIcon from "../assets/LoginEmailIcon.png";
import LoginPassIcon from "../assets/LoginPassIcon.png";
import 'react-toastify/dist/ReactToastify.css';
import { USER_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Register.css';

const Register = ({ setShowRegister }) => {
    const [isPassword1Visible, setIsPassword1Visible] = useState(false);
    const [isPassword2Visible, setIsPassword2Visible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true,
            });
            if(res.data.success){
                setShowRegister(false);
                console.log("Registration Successful.");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response.data.message);
        }
    }

    return (
        <div className='register'>
            <p className='registerHeading'>Register</p>
            <form className='registerForm' onSubmit={registerHandler}>
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
                        placeholder='Email'
                    />
                </div>
                <div className='registerInputCon'>
                    <img src={LoginPassIcon} alt="lock" />
                    <input
                        type={isPassword1Visible ? 'text' : 'password'}
                        value={input.password}
                        name='password'
                        onChange={changeEventHandler}
                        placeholder='Password'
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
                        value={input.confirmPassword}
                        name='confirmPassword'
                        onChange={changeEventHandler}
                        placeholder='Confirm Password'
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
                <button type='submit'>Register</button>
            </form>
            <p className='noAccountPara'>Have no account yet?</p>
            <button onClick={() => setShowRegister(false)}>Log in</button>
            <ToastContainer />
        </div>
    )
}

export default Register;