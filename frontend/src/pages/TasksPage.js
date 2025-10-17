// src/pages/TasksPage.js
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Plus, Trash2 } from 'lucide-react';
import PlannerItemModal from '../components/PlannerItemModal';

const API_URL = 'http://localhost:8000/api';

// 24-hour time slots
const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

// 🎉 Cheerful messages list
const CHEER_MESSAGES = [
  "🎉 Amazing! You nailed it! 🌟",
  "💪 Great job! Keep crushing those tasks!",
  "🌈 You're unstoppable today! ✨",
  "🔥 Boom! Another one bites the dust!",
  "🌻 Way to go! Productivity power-up!",
  "🥳 Task done and dusted! You're on fire!",
  "🌟 Fantastic! You’re smashing your goals!",
  "🚀 One step closer to success!",
  "👏 That’s how champions roll!",
  "💫 Incredible focus! Keep it up!"
];

const TasksPage = ({ tasks, onTaskUpdate }) => {
  const [goals, setGoals] = useState([]);
  const [note, setNote] = useState('');
  const [tomorrowNote, setTomorrowNote] = useState('');
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItemType, setModalItemType] = useState('');
  const [modalDate, setModalDate] = useState(null);
  const [notification, setNotification] = useState(null); // new state for notifications

  const today = moment();
  const todayStr = today.format('YYYY-MM-DD');

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [goalsRes, scheduleRes] = await Promise.all([
        fetch(`${API_URL}/focus-items/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/schedule-events/`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const goalsData = await goalsRes.json();
      const scheduleData = await scheduleRes.json();

      setGoals(Array.isArray(goalsData) ? goalsData : []);
      setScheduleEvents(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (error) {
      console.error("Failed to fetch planner data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const todaysTasks = Array.isArray(tasks)
    ? tasks.filter(task => moment(task.due_date).isSame(today, 'day'))
    : [];

  const openModal = (type, date) => {
    setModalItemType(type.toUpperCase());
    setModalDate(date);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemType, itemData) => {
    const token = localStorage.getItem('token');
    let endpoint = '';

    if (itemType === 'TASK') endpoint = '/tasks/';
    if (itemType === 'GOAL') endpoint = '/focus-items/';
    if (itemType === 'EVENT') endpoint = '/schedule-events/';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (response.ok) {
        if (itemType === 'TASK') onTaskUpdate();
        else fetchData();
      } else {
        console.error(`Failed to save ${itemType}:`, await response.json());
      }
    } catch (error) {
      console.error(`Failed to save ${itemType}:`, error);
    }
  };

  const handleToggleTask = async (task) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      onTaskUpdate();

      // 🎉 Show random cheer when completing a task
      if (!task.completed) {
        const randomCheer = CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)];
        showNotification(`${randomCheer} ✅`);
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleToggleGoal = async (goal) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/focus-items/${goal.id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !goal.completed })
      });
      fetchData();
    } catch (error) {
      console.error("Failed to toggle goal:", error);
    }
  };

  const handleDeleteItem = async (itemType, itemId) => {
    const token = localStorage.getItem('token');
    let endpoint = '';

    if (itemType === 'TASK') endpoint = `/tasks/${itemId}/`;
    if (itemType === 'GOAL') endpoint = `/focus-items/${itemId}/`;
    if (itemType === 'EVENT') endpoint = `/schedule-events/${itemId}/`;

    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        if (itemType === 'TASK') onTaskUpdate();
        else fetchData();
      } else {
        console.error(`Failed to delete ${itemType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  const getEventForSlot = (time) => scheduleEvents.find(event => event.start_time.startsWith(time));

  // 🎈 Function to show notifications
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000); // hide after 4s
  };

  return (
    <>
      <div className="planner-page">
        <header className="planner-header">
          <h1 className="planner-title">Daily Planner</h1>
          <div className="planner-input-group planner-date-input">
            <label>DATE:</label>
            <input type="text" className="planner-input" value={today.format('DD/MM/YYYY')} readOnly />
          </div>
          <div className="planner-input-group planner-month-input">
            <label>MONTH:</label>
            <input type="text" className="planner-input" value={today.format('MMMM')} readOnly />
          </div>
          <div className="planner-week-tracker">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={day+i} className={`week-day ${i === today.isoWeekday() - 1 ? 'active' : ''}`}>{day}</div>
            ))}
          </div>
          <div className="planner-weather">
            <span>☀️</span><span>🌤️</span><span>☁️</span><span>🌧️</span><span>💧</span><span>🌨️</span>
          </div>
        </header>

        <div className="planner-grid">
          <div className="planner-column">
            {/* TO-DO LIST */}
            <div className="planner-card todo">
              <div className="planner-card-title-container">
                <div className="planner-card-title">TO DO LIST</div>
                <button className="add-item-button" onClick={() => openModal('TASK', today)}><Plus size={18} /></button>
              </div>
              <ul className="checklist">
                {todaysTasks.map(task => (
                  <li key={task.id} className="checklist-item">
                    <div
                      className={`checkbox square ${task.completed ? 'completed' : ''}`}
                      onClick={() => handleToggleTask(task)}
                    ></div>
                    <span className={`checklist-item-text ${task.completed ? 'completed' : ''}`}>{task.title}</span>
                    <Trash2
                      size={14}
                      className="delete-icon"
                      onClick={() => handleDeleteItem('TASK', task.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* GOALS */}
            <div className="planner-card goals">
              <div className="planner-card-title-container">
                <div className="planner-card-title">GOALS FOR THE DAY</div>
                <button className="add-item-button" onClick={() => openModal('GOAL', today)}><Plus size={18} /></button>
              </div>
              <ul className="checklist">
                {goals.map(goal => (
                  <li key={goal.id} className="checklist-item">
                    <div
                      className={`checkbox circle ${goal.completed ? 'completed' : ''}`}
                      onClick={() => handleToggleGoal(goal)}
                    ></div>
                    <span className={`checklist-item-text ${goal.completed ? 'completed' : ''}`}>{goal.text}</span>
                    <Trash2
                      size={14}
                      className="delete-icon"
                      onClick={() => handleDeleteItem('GOAL', goal.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* NOTES */}
            <div className="planner-card notes">
              <div className="planner-card-title">NOTES</div>
              <textarea
                className="notes-textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="• Write your notes here..."
              />
            </div>
          </div>

          <div className="planner-column">
            {/* SCHEDULE */}
            <div className="planner-card schedule">
              <div className="planner-card-title">SCHEDULE FOR TODAY</div>
              <div className="schedule-timeline">
                {timeSlots.map(time => {
                  const event = getEventForSlot(time);
                  return (
                    <div key={time} className="schedule-slot">
                      <div className="schedule-time">{time}</div>
                      <div className={`schedule-event ${!event ? 'placeholder' : ''}`}>
                        {event ? (
                          <>
                            {event.title}
                            <Trash2
                              size={14}
                              className="delete-icon"
                              onClick={() => handleDeleteItem('EVENT', event.id)}
                            />
                          </>
                        ) : (
                          <span onClick={() => openModal('EVENT', today)}>+</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOMORROW */}
            <div className="planner-card tomorrow">
              <div className="planner-card-title">FOR TOMORROW</div>
              <textarea
                className="notes-textarea"
                value={tomorrowNote}
                onChange={(e) => setTomorrowNote(e.target.value)}
                placeholder="• Plan your tomorrow..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className="notification success">
          {notification}
        </div>
      )}

      {isModalOpen && (
        <PlannerItemModal
          itemType={modalItemType}
          date={modalDate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}
    </>
  );
};

export default TasksPage;
