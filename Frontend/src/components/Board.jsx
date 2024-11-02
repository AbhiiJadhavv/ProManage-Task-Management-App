import React, { useEffect, useState } from 'react';
import AddPeopleIcon from "../assets/AddPeopleIcon.png";
import CollapseAllIcon from "../assets/CollapseAllIcon.png";
import AddNewTaskIcon from "../assets/AddNewTaskIcon.png";
import '../styles/Board.css';
import Task from './Task';
import axios from "axios";
import { TASK_API_END_POINT } from '../utils/constant';

const Board = ({ user, setShowAddPeople, setShowAddTask, openLinkCopiedToast }) => {
    const [today, setToday] = useState('');
    const [tasks, setTasks] = useState({
        backlog: [],
        toDo: [],
        inProgress: [],
        done: []
    });
    const [expandedChecklists, setExpandedChecklists] = useState({});
    const [selectedDuration, setSelectedDuration] = useState("thisWeek");

    const fetchTasks = async () => {
        if (!user || !user._id) return;

        try {
            const response = await axios.get(`${TASK_API_END_POINT}/user`, {
                params: { userId: user._id },
                withCredentials: true,
            });
            const userTasks = response.data.tasks;

            setTasks({
                backlog: userTasks.filter(task => task.status === "backlog"),
                toDo: userTasks.filter(task => task.status === "toDo"),
                inProgress: userTasks.filter(task => task.status === "inProgress"),
                done: userTasks.filter(task => task.status === "done"),
            });
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
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

    const toggleChecklistExpansion = (taskId) => {
        setExpandedChecklists(prevState => ({
            ...prevState,
            [taskId]: !prevState[taskId]
        }));
    };

    const collapseAllExpandedChecklists = (category) => {
        const updatedState = { ...expandedChecklists };
        tasks[category].forEach(task => {
            if (expandedChecklists[task._id]) {
                updatedState[task._id] = false;
            }
        });
        setExpandedChecklists(updatedState);
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

    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value);
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
                        <select name="duration" id="duration" value={selectedDuration} onChange={handleDurationChange}>
                            <option value="today">Today</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='boardCon'>
                <div className='backlog boardContent'>
                    <div className='boardContentHeader'>
                        <p>Backlog</p>
                        <button className='collapseAllBtn' onClick={() => collapseAllExpandedChecklists("backlog")}>
                            <img src={CollapseAllIcon} alt="compress task" />
                        </button>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.backlog).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                openLinkCopiedToast={openLinkCopiedToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expandedChecklists[task._id] || false}
                                toggleChecklistExpansion={() => toggleChecklistExpansion(task._id)}
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
                            <button className='collapseAllBtn' onClick={() => collapseAllExpandedChecklists("toDo")}>
                                <img src={CollapseAllIcon} alt="compress task" />
                            </button>
                        </div>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.toDo).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                openLinkCopiedToast={openLinkCopiedToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expandedChecklists[task._id] || false}
                                toggleChecklistExpansion={() => toggleChecklistExpansion(task._id)}
                            />
                        ))}
                    </div>
                </div>

                <div className='inProgress boardContent'>
                    <div className='boardContentHeader'>
                        <p>In progress</p>
                        <button className='collapseAllBtn' onClick={() => collapseAllExpandedChecklists("inProgress")}>
                            <img src={CollapseAllIcon} alt="compress task" />
                        </button>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.inProgress).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                openLinkCopiedToast={openLinkCopiedToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expandedChecklists[task._id] || false}
                                toggleChecklistExpansion={() => toggleChecklistExpansion(task._id)}
                            />
                        ))}
                    </div>
                </div>

                <div className='done boardContent'>
                    <div className='boardContentHeader'>
                        <p>Done</p>
                        <button className='collapseAllBtn' onClick={() => collapseAllExpandedChecklists("done")}>
                            <img src={CollapseAllIcon} alt="compress task" />
                        </button>
                    </div>
                    <div className='boardContentCon'>
                        {filterTasksByDuration(tasks.done).map(task => (
                            <Task
                                key={task._id}
                                task={task}
                                openLinkCopiedToast={openLinkCopiedToast}
                                refreshTasks={refreshTasks}
                                isExpanded={expandedChecklists[task._id] || false}
                                toggleChecklistExpansion={() => toggleChecklistExpansion(task._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;
