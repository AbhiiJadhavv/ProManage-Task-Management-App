import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Analytics.css';
import { TASK_API_END_POINT } from '../utils/constant';

const Analytics = ({ user }) => {
    const [analyticsData, setAnalyticsData] = useState({
        backlogCount: 0,
        toDoCount: 0,
        inProgressCount: 0,
        doneCount: 0,
        lowPriorityCount: 0,
        moderatePriorityCount: 0,
        highPriorityCount: 0,
        dueTodayCount: 0,
    });

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user || !user._id) return;

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${TASK_API_END_POINT}/user`, {
                    params: { userId: user._id },
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userTasks = response.data.tasks;

                const backlogTasks = userTasks.filter(task => task.status === "backlog");
                const toDoTasks = userTasks.filter(task => task.status === "toDo");
                const inProgressTasks = userTasks.filter(task => task.status === "inProgress");
                const doneTasks = userTasks.filter(task => task.status === "done");

                const lowPriorityCount = userTasks.filter(task => task.priority === 'low').length;
                const moderatePriorityCount = userTasks.filter(task => task.priority === 'moderate').length;
                const highPriorityCount = userTasks.filter(task => task.priority === 'high').length;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueTodayCount = userTasks.filter(task => {
                    if (!task.dueDate) return false;
                    const dueDate = new Date(task.dueDate);
                    dueDate.setHours(0, 0, 0, 0);
                    return dueDate.getTime() === today.getTime();
                }).length;

                setAnalyticsData({
                    backlogCount: backlogTasks.length,
                    toDoCount: toDoTasks.length,
                    inProgressCount: inProgressTasks.length,
                    doneCount: doneTasks.length,
                    lowPriorityCount,
                    moderatePriorityCount,
                    highPriorityCount,
                    dueTodayCount,
                });
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };

        fetchTasks();
    }, [user]);

    return (
        <div className='analytics'>
            <p>Analytics</p>
            <div>
                <div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>Backlog Tasks</p>
                        </div>
                        <p>{analyticsData.backlogCount}</p>
                    </div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>To-do Tasks</p>
                        </div>
                        <p>{analyticsData.toDoCount}</p>
                    </div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>In-Progress Tasks</p>
                        </div>
                        <p>{analyticsData.inProgressCount}</p>
                    </div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>Completed Tasks</p>
                        </div>
                        <p>{analyticsData.doneCount}</p>
                    </div>
                </div>

                <div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>Low Priority</p>
                        </div>
                        <p>{analyticsData.lowPriorityCount}</p>
                    </div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>Moderate Priority</p>
                        </div>
                        <p>{analyticsData.moderatePriorityCount}</p>
                    </div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>High Priority</p>
                        </div>
                        <p>{analyticsData.highPriorityCount}</p>
                    </div>
                    <div className='analyticsPoint'>
                        <div>
                            <div></div>
                            <p>Due Today</p>
                        </div>
                        <p>{analyticsData.dueTodayCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
