import React, { useState } from 'react';
import axios from 'axios';
import MoreOptionsIcon from "../assets/MoreOptionsIcon.png";
import ExpandIcon from "../assets/ExpandIcon.png";
import CompressIcon from "../assets/CompressIcon.png";
import '../styles/Task.css';
import { TASK_API_END_POINT } from '../utils/constant';
import DeleteTaskPopup from './DeleteTaskPopup';
import UpdateTaskPopup from './UpdateTaskPopup';

const Task = ({ task, showToast, refreshTasks, isExpanded, toggleListExp }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [checklistItems, setChecklistItems] = useState(task.checklistItems || []);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteTask, setShowDeleteTask] = useState(false);
    const [showUpdateTask, setShowUpdateTask] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const completedCount = checklistItems.filter(item => item.completed).length;

    const toggleListItemComp = async (index) => {
        const updatedChecklistItems = [...checklistItems];
        updatedChecklistItems[index].completed = !updatedChecklistItems[index].completed;
        setChecklistItems(updatedChecklistItems);

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${TASK_API_END_POINT}/${task._id}/checklist/toggle`,
                { index },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            refreshTasks();
        } catch (error) {
            console.error("Failed to update checklist item:", error);
        }
    };

    const deleteTaskHandler = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${TASK_API_END_POINT}/${task._id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            refreshTasks(); 
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setShowDeleteTask(false); 
        }
    };

    const handleShare = () => {
        const shareableLink = `${window.location.origin}/sharedtask/${task._id}`;
        navigator.clipboard
            .writeText(shareableLink)
            .then(() => {
                console.log("Link copied to clipboard");
                showToast();
            })
            .catch(() => {
                console.log("Failed to copy link");
            });
    };        

    const handleStatusChange = async (newStatus) => {
        try {
            setIsUpdating(true);
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${TASK_API_END_POINT}/${task._id}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                console.log("Status Changed.");
                refreshTasks();
            }
        } catch (error) {
            console.error("Failed to update task status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getCategoryButtons = () => {
        switch (task.status) {
            case 'toDo': return ['backlog', 'inProgress', 'done'];
            case 'backlog': return ['toDo', 'inProgress', 'done'];
            case 'inProgress': return ['backlog', 'toDo', 'done'];
            case 'done': return ['backlog', 'toDo', 'inProgress'];
            default: return ['backlog', 'toDo', 'inProgress'];
        }
    };

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

    const getDueDateClassName = () => {
        if (!task.dueDate) return 'white';
    
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const isPastDue = dueDate < today;
    
        if (task.priority === 'high') return 'red';
        if ((task.priority === 'low' || task.priority === 'moderate') && isPastDue) return 'red';
        if (task.priority === 'low' || task.priority === 'moderate') return 'grey';
    
        return '';
    };

    const categoryButtons = getCategoryButtons();

    return (
        <div className={`task ${isUpdating ? 'updating' : ''}`}>
            <div className='taskHeader'>
                <div className='prioritySection'>
                    <div className={`priorityIndicator ${task.priority.toLowerCase()}`}></div>
                    <p>{task.priority.toUpperCase()} PRIORITY</p>
                </div>
                <button className='moreOptionsBtn' onClick={toggleMenu}>
                    <img src={MoreOptionsIcon} alt="More Options" />
                </button>
                <div id="popoverContent" style={{ display: isOpen ? 'flex' : 'none' }}>
                    <button onClick={() => setShowUpdateTask(true)}>Edit</button>
                    <button onClick={handleShare}>Share</button>
                    <button style={{ color: '#CF3636' }} onClick={() => setShowDeleteTask(true)}>Delete</button>
                </div>
            </div>
            <p className='taskTitle'>{task.title}</p>
            <div className='taskChecklistHeader'>
                <p>Checklist ({completedCount}/{checklistItems.length})</p>
                <button onClick={toggleListExp}>
                    <img src={isExpanded ? CompressIcon : ExpandIcon} alt="Toggle Checklist" />
                </button>
            </div>
            {isExpanded && (
                <div className='taskChecklistCon'>
                    {checklistItems.map((item, index) => (
                        <div key={index} className='checklistItem'>
                            <input
                                type="checkbox"
                                name={task._id + index}
                                checked={item.completed}
                                onChange={() => toggleListItemComp(index)}
                                className='addTaskChecklistCheckbox'
                            />
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className='taskBtnsCon'>
                <div className={`taskDueDateCon ${getDueDateClassName()}`}>{formatDueDate(task.dueDate)}</div>
                <div className='taskCategoryBtns'>
                    {categoryButtons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => handleStatusChange(btn)}
                        >
                            {btn.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            {showDeleteTask && <DeleteTaskPopup setShowDeleteTask={setShowDeleteTask} deleteTaskHandler={deleteTaskHandler} />}
            {showUpdateTask && <UpdateTaskPopup setShowUpdateTask={setShowUpdateTask} task={task} refreshTasks={refreshTasks} />}
        </div>
    );
};

export default Task;
