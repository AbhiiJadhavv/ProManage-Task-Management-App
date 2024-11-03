import React, { useRef, useState, useEffect } from 'react';
import DeleteChecklistIcon from "../assets/DeleteChecklistIcon.png";
import '../styles/AddTaskPopup.css';
import axios from 'axios';
import { TASK_API_END_POINT, USER_API_END_POINT } from '../utils/constant';

const UpdateTaskPopup = ({ setShowUpdateTask, task, refreshTasks }) => {
    const [checklistItems, setChecklistItems] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [userEmails, setUserEmails] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dateInputRef = useRef(null);

    const [input, setInput] = useState({
        title: "",
        priority: "",
        assignTo: "",
        checklistItems: [],
        dueDate: "",
    });

    const completedCount = checklistItems.filter(item => item.completed).length;

    useEffect(() => {
        if (task) {
            setInput({
                title: task.title,
                priority: task.priority,
                assignTo: task.assignTo,
                checklistItems: task.checklistItems,
                dueDate: task.dueDate,
            });
            setChecklistItems(task.checklistItems);
            setSelectedPriority(task.priority);
            setSelectedDate(task.dueDate);
        }
    }, [task]);

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

    const addChecklistItem = () => {
        const newChecklistItem = { text: '', completed: false };
        setChecklistItems([...checklistItems, newChecklistItem]);
        setInput({ ...input, checklistItems: [...checklistItems, newChecklistItem] });
    };

    const updateChecklistItem = (index, text) => {
        const newChecklistItems = [...checklistItems];
        newChecklistItems[index].text = text;
        setChecklistItems(newChecklistItems);
        setInput({ ...input, checklistItems: newChecklistItems });
    };

    const toggleChecklistItemCompletion = (index) => {
        const newChecklistItems = [...checklistItems];
        newChecklistItems[index].completed = !newChecklistItems[index].completed;
        setChecklistItems(newChecklistItems);
        setInput({ ...input, checklistItems: newChecklistItems });
    };

    const deleteChecklistItem = (index) => {
        const newChecklistItems = checklistItems.filter((_, i) => i !== index);
        setChecklistItems(newChecklistItems);
        setInput({ ...input, checklistItems: newChecklistItems });
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setInput({ ...input, dueDate: e.target.value });
    };

    const handleDatePlaceholderClick = () => {
        dateInputRef.current.showPicker();
    };

    const handleAssignToClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleEmailSelect = (email) => {
        setInput({ ...input, assignTo: email });
        setShowDropdown(false);
    };

    const updateTaskHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${TASK_API_END_POINT}/${task._id}`, input, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log("Task updated successfully.");
            refreshTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        } finally {
            setShowUpdateTask(false);
            window.location.reload();
        }
    };

    return (
        <div className='addTaskPopupCon'>
            <form className='addTaskPopup' onSubmit={updateTaskHandler}>
                <p className='addTaskPara required-field'>Title</p>
                <input
                    type='text'
                    name='taskTitle'
                    placeholder='Enter Task Title'
                    value={input.title}
                    onChange={(e) => setInput({ ...input, title: e.target.value })}
                />
                <div className='selectPriorityCon'>
                    <p className='addTaskPara required-field'>Select Priority</p>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedPriority('high');
                            setInput({ ...input, priority: 'high' });
                        }}
                        className={selectedPriority === 'high' ? 'selectedPriority' : ''}
                    >
                        <div className='highPriorityColor'></div>
                        <p>HIGH PRIORITY</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedPriority('moderate');
                            setInput({ ...input, priority: 'moderate' });
                        }}
                        className={selectedPriority === 'moderate' ? 'selectedPriority' : ''}
                    >
                        <div className='moderatePriorityColor'></div>
                        <p>MODERATE PRIORITY</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedPriority('low');
                            setInput({ ...input, priority: 'low' });
                        }}
                        className={selectedPriority === 'low' ? 'selectedPriority' : ''}
                    >
                        <div className='lowPriorityColor'></div>
                        <p>LOW PRIORITY</p>
                    </button>
                </div>
                <div className='addTaskAssignToCon'>
                    <p className='addTaskPara'>Assign to</p>
                    <input
                        type='text'
                        value={input.assignTo}
                        name='addAssignee'
                        placeholder='Add an assignee'
                        readOnly
                        onClick={handleAssignToClick}
                    />
                    {showDropdown && (
                        <div className='assignToDropdown'>
                            {userEmails.map((email, index) => (
                                <div key={index} className='dropdownItem'>
                                    <div>
                                        <div className='initials'>{email.slice(0, 2).toUpperCase()}</div>
                                        <p>{email}</p>
                                    </div>
                                    <button onClick={() => handleEmailSelect(email)}>Assign</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p className='addTaskChecklistPara required-field'>
                    Checklist ({completedCount}/{checklistItems.length})
                </p>
                <div className='addTaskChecklistCon'>
                    {checklistItems.map((item, index) => (
                        <div key={index} className='addTaskChecklistPoint'>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                name='checklistCheckbox'
                                onChange={() => toggleChecklistItemCompletion(index)}
                                className='addTaskChecklistCheckbox'
                            />
                            <input
                                type='text'
                                value={item.text}
                                onChange={(e) => updateChecklistItem(index, e.target.value)}
                                placeholder='Type...'
                                name='checkboxInput'
                                className='addTaskChecklistInput'
                            />
                            <button className='DeleteChecklistBtn' onClick={() => deleteChecklistItem(index)}>
                                <img src={DeleteChecklistIcon} alt="Delete" />
                            </button>
                        </div>
                    ))}
                    <button type="button" className='addNewChecklistBtn' onClick={addChecklistItem}>
                        <span>+</span><p>Add New</p>
                    </button>
                </div>
                <div className='addTaskBtnsCon'>
                    <div className='dateInputWrapper'>
                        {!selectedDate && (
                            <span className='datePlaceholder' onClick={handleDatePlaceholderClick}>Select Due Date</span>
                        )}
                        <input
                            ref={dateInputRef}
                            className={`addTaskCalendar ${selectedDate ? '' : 'hidden'}`}
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div>
                        <button className='addTaskCancelBtn' type="button" onClick={() => setShowUpdateTask(false)}>Cancel</button>
                        <button className='addTaskSaveBtn' type='submit'>Update</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateTaskPopup;
