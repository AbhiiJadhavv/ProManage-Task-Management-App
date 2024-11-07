import React, { useEffect, useState } from 'react';
import AddPeopleIcon from "../assets/AddPeopleIcon.png";
import CollapseAllIcon from "../assets/CollapseAllIcon.png";
import AddNewTaskIcon from "../assets/AddNewTaskIcon.png";
import DownArrowIcon from "../assets/DownArrowIcon.png";
import '../styles/Board.css';
import Task from './Task';
import axios from "axios";
import { TASK_API_END_POINT } from '../utils/constant';

const Board = ({ user, setShowAddPeople, setShowAddTask, showToast }) => {
    const [today, setToday] = useState('');
    const [tasks, setTasks] = useState({
        backlog: [],
        toDo: [],
        inProgress: [],
        done: []
    });
    const [expLists, setExpLists] = useState({});
    const [selectedDuration, setSelectedDuration] = useState("thisWeek");
    const [isPopoverOpen, setPopoverOpen] = useState(false);

    const fetchTasks = async () => {
        if (!user || !user._id) return;
    
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${TASK_API_END_POINT}/user`, {
                params: { userId: user._id },
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const userTasks = response.data.tasks;
            setTasks({
                backlog: userTasks.filter((task) => task.status === "backlog"),
                toDo: userTasks.filter((task) => task.status === "toDo"),
                inProgress: userTasks.filter((task) => task.status === "inProgress"),
                done: userTasks.filter((task) => task.status === "done"),
            });
        } catch (error) {
            console.error("Failed to fetch tasks:", error.response?.data?.message || error.message);
        }
    };        

    useEffect(() => {
        const formatDate = (date) => {
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();

            const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                day === 2 || day === 22 ? 'nd' :
                day === 3 || day === 23 ? 'rd' : 'th';

            return `${day}${suffix} ${month}, ${year}`;
        };
        setToday(formatDate(new Date()));
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const refreshTasks = async () => {
        fetchTasks();
    };

    const toggleListExp = (taskId) => {
        setExpLists(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }));
    };

    const collapseAllExpLists = (category) => {
        const updatedState = { ...expLists };
        tasks[category].forEach(task => {
            if (expLists[task._id]) {
                updatedState[task._id] = false;
            }
        });
        setExpLists(updatedState);
    };

    const filterTasksByDuration = (taskList) => {
        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const endOfThisWeek = new Date(now);
        endOfThisWeek.setDate(now.getDate() + (7 - now.getDay()));
        const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return taskList.filter(task => {
            if (!task.dueDate) return true;

            const dueDate = new Date(task.dueDate);

            if (selectedDuration === "today") {
                return dueDate <= endOfToday;
            } else if (selectedDuration === "thisWeek") {
                return dueDate <= endOfThisWeek;
            } else if (selectedDuration === "thisMonth") {
                return dueDate <= endOfThisMonth;
            }
            return false;
        });
    };

    const handleDurationChange = (value) => {
        setSelectedDuration(value);
        setPopoverOpen(false);
    };

    return (
        <div className='board'>
            <div className='boardHeader'>
                <div>
                    <p className='boardWelcomePara'>Welcome! {user?.name}</p>
                    <div className='boardHeadingCon'>
                        <p>Board</p>
                        <div className='addPeopleBtn' onClick={() => setShowAddPeople(true)}>
                            <img src={AddPeopleIcon} alt="add people" />
                            <p>Add People</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className='todayDate'>{today}</p>
                    <div className="durationSelect">
                        <div onClick={() => setPopoverOpen(!isPopoverOpen)} className="durationButton">
                            <p>{selectedDuration === "today" ? "Today" : selectedDuration === "thisWeek" ? "This Week" : "This Month"}</p>
                            <img src={DownArrowIcon} alt="select duration" />
                        </div>
                        {isPopoverOpen && (
                            <div className="popoverContent2">
                                <div onClick={() => handleDurationChange("today")}>Today</div>
                                <div onClick={() => handleDurationChange("thisWeek")}>This Week</div>
                                <div onClick={() => handleDurationChange("thisMonth")}>This Month</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='boardCon'>
                <div className='backlog boardContent'>
                    <div className='boardContentHeader'>
                        <p>Backlog</p>
                        <button className='collapseAllBtn' onClick={() => collapseAllExpLists("backlog")}>
                            <img src={CollapseAllIcon} alt="compress task" />
                        </button>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.backlog).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                showToast={showToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expLists[task._id] || false}
                                toggleListExp={() => toggleListExp(task._id)}
                            />
                        ))}
                    </div>
                </div>

                <div className='toDo boardContent'>
                    <div className='boardContentHeader'>
                        <p>To do</p>
                        <div className='toDoHeaderBtns'>
                            <button onClick={() => setShowAddTask(true)}>
                                <img src={AddNewTaskIcon} alt="add task" />
                            </button>
                            <button className='collapseAllBtn' onClick={() => collapseAllExpLists("toDo")}>
                                <img src={CollapseAllIcon} alt="compress task" />
                            </button>
                        </div>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.toDo).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                showToast={showToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expLists[task._id] || false}
                                toggleListExp={() => toggleListExp(task._id)}
                            />
                        ))}
                    </div>
                </div>

                <div className='inProgress boardContent'>
                    <div className='boardContentHeader'>
                        <p>In progress</p>
                        <button className='collapseAllBtn' onClick={() => collapseAllExpLists("inProgress")}>
                            <img src={CollapseAllIcon} alt="compress task" />
                        </button>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.inProgress).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                showToast={showToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expLists[task._id] || false}
                                toggleListExp={() => toggleListExp(task._id)}
                            />
                        ))}
                    </div>
                </div>

                <div className='done boardContent'>
                    <div className='boardContentHeader'>
                        <p>Done</p>
                        <button className='collapseAllBtn' onClick={() => collapseAllExpLists("done")}>
                            <img src={CollapseAllIcon} alt="compress task" />
                        </button>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.done).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                showToast={showToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expLists[task._id] || false}
                                toggleListExp={() => toggleListExp(task._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;
