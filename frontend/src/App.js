import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

// Layout & Pages
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';

// Styles
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTasks([]);
    setCategories([]);
    showNotification('Goodbye! 👋');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Ensure stored theme is one of our supported lemon variants (light/dark)
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const allowed = new Set(['light', 'dark']);
    if (!saved || !allowed.has(saved)) {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Removed lemon theme variants

  const fetchUserData = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/users/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setUser(await response.json());
      } else {
        handleLogout();
      }
    } catch (error) { 
      console.error('Error fetching user data:', error);
    }
  }, []);

  const fetchTasks = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (error) { 
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  }, []);

  const fetchCategories = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/categories/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setCategories(await response.json());
    } catch (error) { 
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
      fetchTasks(token);
      fetchCategories(token);
    }
  }, [fetchUserData, fetchTasks, fetchCategories]);

  const handleAuth = async (formData) => {
    const endpoint = isLogin ? '/auth/jwt/create/' : '/auth/users/';
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        showNotification('Authentication failed.', 'error');
        return; // Stop execution if auth fails
      }
      
      if (isLogin) {
        const data = await response.json();
        const token = data.access;
        localStorage.setItem('token', token);
        await fetchUserData(token);
        await fetchTasks(token);
        await fetchCategories(token);
        showNotification('Welcome back! ✨');
      } else {
        showNotification('Account created! Please login.');
        setIsLogin(true);
      }
    } catch (error) { 
      console.error("Auth error:", error);
      showNotification('Authentication failed.', 'error'); 
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const resp = await fetch(`${API_URL}/auth/users/reset_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (resp.ok) {
        showNotification('Reset link sent to your email ✅');
      } else {
        showNotification('Failed to send reset email', 'error');
      }
    } catch (e) {
      showNotification('Failed to send reset email', 'error');
    }
  };

  const handleAddTask = async (newTaskData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

  try {
    const response = await fetch(`${API_URL}/api/tasks/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(newTaskData)
    });

    if (response.ok) {
      showNotification('Task added successfully! ✅');
      // Refresh tasks after adding
      await fetchTasks(token);
    } else {
      const errorData = await response.json();
      console.error('Failed to add task:', errorData);
      showNotification('Failed to add task.', 'error');
    }
  } catch (error) {
    console.error('Error adding task:', error);
    showNotification('Failed to add task.', 'error');
  }
};
  
  const triggerTaskRefresh = () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchTasks(token);
    }
  };

  return (
    <>
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
      <Router>
        <Routes>
          {/* ✔️ ENSURE THIS LINE IS CORRECT */}
          <Route path="/login" element={!user ? <Login handleAuth={handleAuth} isLogin={isLogin} setIsLogin={setIsLogin} onForgotPassword={handleForgotPassword} /> : <Navigate to="/" />} />
          
          <Route element={user ? <MainLayout /> : <Navigate to="/login" />}>
            <Route path="/" element={<HomePage 
              user={user} 
              handleLogout={handleLogout} 
              isDark={theme === 'dark'}
              onToggleTheme={toggleTheme}
              onChangeEmail={async (newEmail) => {
                const token = localStorage.getItem('token');
                if (!token) return;
                try {
                  const resp = await fetch(`${API_URL}/auth/users/me/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ email: newEmail })
                  });
                  if (resp.ok) {
                    showNotification('Email updated ✅');
                    await fetchUserData(token);
                  } else {
                    showNotification('Failed to update email', 'error');
                  }
                } catch (e) {
                  showNotification('Failed to update email', 'error');
                }
              }}
              onChangePassword={async ({ currentPassword, newPassword, reNewPassword }) => {
                const token = localStorage.getItem('token');
                if (!token) return;
                if (newPassword !== reNewPassword) {
                  showNotification('Passwords do not match', 'error');
                  return;
                }
                try {
                  const resp = await fetch(`${API_URL}/auth/users/set_password/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, re_new_password: reNewPassword })
                  });
                  if (resp.ok) {
                    showNotification('Password updated ✅');
                  } else {
                    showNotification('Failed to update password', 'error');
                  }
                } catch (e) {
                  showNotification('Failed to update password', 'error');
                }
              }}
            />} />
            <Route 
              path="/tasks" 
              element={<TasksPage 
                tasks={tasks} 
                onTaskUpdate={triggerTaskRefresh} 
              />} 
            /> 
            <Route path="/calendar" element={<CalendarPage tasks={tasks} onTaskUpdate={triggerTaskRefresh} />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;