import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/SharedTask.css';
import ProManageIcon from "../assets/ProManageIcon.png";
import { TASK_API_END_POINT } from '../utils/constant';

const SharedTask = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`${TASK_API_END_POINT}/shared/${taskId}`);
                setTask(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching task:", err);
                setError("Task not found or an error occurred");
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    if (loading) return <div className="loading">
        <div className="dott"></div>
        <span className="textt">
            Loading....
        </span>
    </div>;
    if (error) return <div>{error}</div>;

    const { title, priority = "low", checklistItems = [], dueDate } = task;
    const completedCount = checklistItems.filter(item => item.completed).length;

    const formatDueDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];

        const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
            day === 2 || day === 22 ? 'nd' :
                day === 3 || day === 23 ? 'rd' : 'th';

        return `${month} ${day}${suffix}`;
    };

    return (
        <div className='sharedTaskCon'>
            <div className='proManageLogoCon2'>
                <img src={ProManageIcon} alt="ProManage logo" />
                <p>Pro Manage</p>
            </div>
            <div className='sharedTask'>
                <div className='prioritySection2'>
                    <div className={`priorityIndicator2 ${priority ? priority.toLowerCase() : 'low'}`}></div>
                    <p>{priority.toUpperCase()} PRIORITY</p>
                </div>
                <p className='taskTitle2'>{title}</p>
                <div className='taskChecklistHeader2'>
                    <p>Checklist ({completedCount}/{checklistItems.length})</p>
                </div>
                <div className='taskChecklistCon2'>
                    {checklistItems.map((item, index) => (
                        <div key={index} className='checklistItem'>
                            <input
                                type="checkbox"
                                name={taskId + index}
                                checked={item.completed}
                                readOnly
                                className='addTaskChecklistCheckbox'
                            />
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
                {dueDate && (
                    <div className='sharedTaskDateCon'>
                        <p>Due Date</p>
                        <div className='taskDueDateCon2'>{formatDueDate(dueDate)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedTask;
