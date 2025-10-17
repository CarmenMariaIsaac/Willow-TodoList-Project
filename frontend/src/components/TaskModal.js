import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// ✔️ FIX IS HERE: We add "= []" to the categories prop.
// This sets a default empty array if the prop is undefined.
const TaskModal = ({ onClose, categories = [], handleAddTask, initialDueDate = '', initialCategory = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: initialDueDate,
    priority: 'M',
    category: initialCategory,
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      due_date: initialDueDate,
      category: initialCategory
    }));
  }, [initialDueDate, initialCategory]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAddTask(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button">
          <X size={24} />
        </button>
        <h2 className="modal-title">Add New Task</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date</label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              className="form-input"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="L">Low</option>
              <option value="M">Medium</option>
              <option value="H">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category (Optional)</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">None</option>
              {/* This line will no longer crash because categories is guaranteed to be an array */}
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="modal-submit-button">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;