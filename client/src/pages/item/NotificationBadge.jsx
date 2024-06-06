import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function NotificationBadge() {
    const [count, setCount] = useState(0);
    const [lastChecked, setLastChecked] = useState(new Date().toISOString());
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the initial count
        fetchNotificationCount();

        // Set an interval to fetch the count every 1 second
        const interval = setInterval(() => {
            fetchNotificationCount();
        }, 1000); // Update every 1 second

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/camera/images/after/${lastChecked}`);
            setCount(response.data.images.length);
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    };

    const handleClick = async () => {
        try {
            // Set the count to 0 immediately
            setCount(0);
            
            // Update the last checked timestamp
            const timestamp = new Date().toISOString();
            setLastChecked(timestamp);
    
            // Mark notifications as seen
            await markNotificationsAsSeen();
    
            // Navigate to the specified page
            await navigate('/more');
    
            // Fetch the updated count after navigation
            await fetchNotificationCount();
        } catch (error) {
            console.error('Error handling click:', error);
        }
    };
    
    const markNotificationsAsSeen = async () => {
        try {
            // Make a request to mark notifications as seen
            await axios.put('http://localhost:3000/camera/images/mark-as-seen');
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
        }
    };

    return (
        <div className="notification-container" onClick={handleClick}>
            <i className="alert-icon">🔔</i>
            {count > 0 && <span className="badge">{count}</span>}
        </div>
    );
}

export default NotificationBadge;
