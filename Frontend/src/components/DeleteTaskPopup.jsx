import React from 'react';
import '../styles/LogoutPopup.css';

const DeleteTaskPopup = ({ setShowDeleteTask, deleteTaskHandler }) => {
  return (
    <div className='logoutPopupCon'>
      <div className='logoutPopup'>
        <p>Are you sure you want to delete?</p>
        <button className='logoutPopupBtn' onClick={deleteTaskHandler}>Yes, Delete</button>
        <button className='hideLogoutBtn' onClick={() => setShowDeleteTask(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteTaskPopup;
