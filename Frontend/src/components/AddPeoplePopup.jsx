import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TASK_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import '../styles/AddPeoplePopup.css';

const AddPeoplePopup = ({ setShowAddPeople, setShowAddPeople2, email, setEmail, user }) => {
    const [userEmails, setUserEmails] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchUserEmails = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/emails`);
                setUserEmails(response.data);
            } catch (error) {
                console.error("Error fetching user emails:", error);
            }
        };
        fetchUserEmails();
    }, []);

    const handleAddPeopleCancel = () => {
        setShowAddPeople(false);
        setEmail("");
    };

    const handleEmailInputClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleEmailSelect = (selectedEmail) => {
        setEmail(selectedEmail);
        setShowDropdown(false);
    };

    const handleAddEmail = async () => {
        try {
            const token = localStorage.getItem("token");
            const currentUserId = user._id;
    
            await axios.put(
                `${TASK_API_END_POINT}/addUser`,
                {
                    currentUserId,
                    newUserEmail: email,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setShowAddPeople(false);
            setShowAddPeople2(true);
            console.log("Email added to the board.");
        } catch (error) {
            console.error("Error adding email to tasks:", error);
        }
    };    

    return (
        <div className='addPeoplePopupCon'>
            <div className='addPeoplePopup'>
                <p>Add people to the board</p>
                <div className='addPeopleInputCon'>
                    <input
                        type='text'
                        value={email}
                        name='email'
                        placeholder='Enter the email'
                        readOnly
                        onClick={handleEmailInputClick}
                    />
                    {showDropdown && (
                        <div className='addPeopleDropdown'>
                            {userEmails.map((userEmail, index) => (
                                <div key={index} className='addPeopleDropdownItem'>
                                    <div>
                                        <div className='initials'>{userEmail.slice(0, 2).toUpperCase()}</div>
                                        <p>{userEmail}</p>
                                    </div>
                                    <button onClick={() => handleEmailSelect(userEmail)}>Assign</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <button className='addPeopleCancelBtn' onClick={handleAddPeopleCancel}>Cancel</button>
                    <button className='addPeopleEmailBtn' onClick={handleAddEmail}>Add Email</button>
                </div>
            </div>
        </div>
    );
};

export default AddPeoplePopup;
