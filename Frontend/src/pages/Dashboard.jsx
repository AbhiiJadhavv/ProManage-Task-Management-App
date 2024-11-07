import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { ToastContainer } from 'react-toastify';
import ProManageIcon from "../assets/ProManageIcon.png";
import BoardIcon from "../assets/BoardIcon.png";
import AnalyticsIcon from "../assets/AnalyticsIcon.png";
import SettingsIcon from "../assets/SettingsIcon.png";
import LogoutIcon from "../assets/LogoutIcon.png";
import Board from '../components/Board';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';
import '../styles/Dashboard.css';
import LogoutPopup from '../components/LogoutPopup';
import AddPeoplePopup from '../components/AddPeoplePopup';
import AddTaskPopup from '../components/AddTaskPopup';
import AddPeoplePopup2 from '../components/AddPeoplePopup2';

const Dashboard = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('board');
    const [showLogout, setShowLogout] = useState(false);
    const [showAddPeople, setShowAddPeople] = useState(false);
    const [showAddPeople2, setShowAddPeople2] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showLinkCopied, setShowLinkCopied] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setIsLoading(false);
            } else {
                navigate("/form");
            }
        }
    }, [user, navigate]);

    if (isLoading) {
        return <div className="loading">
            <div className="dott"></div>
            <span className="textt">
                Loading....
            </span>
        </div>;
    }

    const showToast = () => {
        setShowLinkCopied(true);
        setTimeout(() => {
            setShowLinkCopied(false);
        }, 3000);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'board':
                return <Board user={user} setShowAddPeople={setShowAddPeople} setShowAddTask={setShowAddTask} showToast={showToast} />;
            case 'analytics':
                return <Analytics user={user} />;
            case 'settings':
                return <Settings user={user} setUser={setUser} />;
            default:
                return <Board user={user} setShowAddPeople={setShowAddPeople} setShowAddTask={setShowAddTask} showToast={showToast} />;
        }
    }

    return (
        <div className='dashboard'>
            <div className='dashboardBtnsCon'>
                <div className='proManageLogoCon'>
                    <img src={ProManageIcon} alt="logo" />
                    <p>Pro Manage</p>
                </div>

                <div className={`dashboardBtns ${activeTab === 'board' ? 'active2' : ''}`} onClick={() => setActiveTab('board')} >
                    <img src={BoardIcon} alt="board" />
                    <p>Board</p>
                </div>

                <div className={`dashboardBtns ${activeTab === 'analytics' ? 'active2' : ''}`} onClick={() => setActiveTab('analytics')} >
                    <img src={AnalyticsIcon} alt="analytics" />
                    <p>Analytics</p>
                </div>

                <div className={`dashboardBtns ${activeTab === 'settings' ? 'active2' : ''}`} onClick={() => setActiveTab('settings')} >
                    <img src={SettingsIcon} alt="settings" />
                    <p>Settings</p>
                </div>

                <div className='logoutBtn' onClick={() => setShowLogout(true)}>
                    <img src={LogoutIcon} alt="log out" />
                    <p>Log out</p>
                </div>
            </div>

            <div className='dashboardContent'>
                {renderContent()}
            </div>

            {showLogout && (
                <LogoutPopup setShowLogout={setShowLogout} setUser={setUser} />
            )}

            {showAddPeople && (
                <AddPeoplePopup setShowAddPeople={setShowAddPeople} setShowAddPeople2={setShowAddPeople2} email={email} setEmail={setEmail} user={user} />
            )}

            {showAddPeople2 && (
                <AddPeoplePopup2 setShowAddPeople2={setShowAddPeople2} email={email} setEmail={setEmail} />
            )}

            {showAddTask && (
                <AddTaskPopup setShowAddTask={setShowAddTask} user={user} />
            )}

            {showLinkCopied && (
                <div className='linkCopiedToast'><p>Link Copied</p></div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Dashboard;
