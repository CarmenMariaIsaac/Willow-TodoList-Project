import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import PlannerItemModal from '../components/PlannerItemModal';

const localizer = momentLocalizer(moment);

const CalendarPage = ({ tasks, onTaskUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);

  const events = Array.isArray(tasks) ? tasks.map(task => {
    if (task.start_time) {
      const startTime = moment(`${task.due_date}T${task.start_time}`).toDate();
      const endTime = task.end_time ? moment(`${task.due_date}T${task.end_time}`).toDate() : moment(startTime).add(1, 'hour').toDate();
      return {
        title: task.title,
        start: startTime,
        end: endTime,
        allDay: false,
        resource: task,
      };
    }
    return {
      title: task.title,
      start: new Date(task.due_date),
      end: new Date(task.due_date),
      allDay: true,
      resource: task,
    };
  }) : [];

  const handleSelectSlot = (slotInfo) => {
    setSlotInfo(slotInfo);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (itemType, itemData) => {
    const token = localStorage.getItem('token');
    const endpoint = '/tasks/';

    const payload = {
      ...itemData,
      due_date: moment(slotInfo.start).format('YYYY-MM-DD'),
      start_time: moment(slotInfo.start).format('HH:mm:ss'),
      end_time: moment(slotInfo.end).format('HH:mm:ss'),
    };
    
    delete payload.date; // The backend task model uses due_date

    try {
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        onTaskUpdate();
      } else {
        console.error("Failed to save event:", await response.json());
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  return (
    <>
      <div className="page-container calendar-page">
        <h1 className="home-title" style={{ fontFamily: 'Lora, serif', marginBottom: '20px' }}>Monthly Overview</h1>
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            selectable={true}
            onSelectSlot={handleSelectSlot}
          />
        </div>
      </div>

      {isModalOpen && (
        <PlannerItemModal
          itemType="TASK"
          date={slotInfo.start}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
        />
      )}
    </>
  );
};

export default CalendarPage;
