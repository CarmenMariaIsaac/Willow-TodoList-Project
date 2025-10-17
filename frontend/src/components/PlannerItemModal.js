import React, { useState } from 'react';
import { X } from 'lucide-react';
import moment from 'moment';

const PlannerItemModal = ({ itemType, date, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let itemData = {};

    if (itemType === 'TASK') {
      itemData = {
        title: title,
        due_date: moment(date).format('YYYY-MM-DD'),
      };
    } else if (itemType === 'GOAL') {
      itemData = {
        text: title, // Backend expects 'text' for a FocusItem
        date: moment(date).format('YYYY-MM-DD'),
      };
    } else if (itemType === 'EVENT') {
      itemData = {
        title: title,
        start_time: startTime,
        date: moment(date).format('YYYY-MM-DD'),
      };
    }
    
    onSave(itemType, itemData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
        <h2 className="modal-title">Add New {itemType}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">{itemType === 'EVENT' ? 'Event Title' : 'Title'}</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {itemType === 'EVENT' && (
            <div className="form-group">
              <label htmlFor="start_time">Time</label>
              <input
                id="start_time"
                name="start_time"
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          )}
          
          <button type="submit" className="modal-submit-button">Add {itemType}</button>
        </form>
      </div>
    </div>
  );
};

export default PlannerItemModal;