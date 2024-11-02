import React from 'react';
import '../styles/AddPeoplePopup2.css';

const AddPeoplePopup2 = ({ setShowAddPeople2, email, setEmail }) => {

    const handleOkayGotIt = () => {
        setShowAddPeople2(false);
        setEmail("");
    };

    return (
        <div className='addPeoplePopup2Con'>
            <div className='addPeoplePopup2'>
                <p>{email} added to board</p>
                <button onClick={handleOkayGotIt}>Okay, got it!</button>
            </div>
        </div>
    )
}

export default AddPeoplePopup2;