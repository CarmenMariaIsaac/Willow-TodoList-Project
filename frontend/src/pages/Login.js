import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ handleAuth, isLogin, setIsLogin, onForgotPassword }) => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // This calls the function passed down from App.js
    handleAuth(formData); 
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const emailToUse = resetEmail || formData.email;
    if (!emailToUse) return;
    await onForgotPassword?.(emailToUse);
    setShowReset(false);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Daily Planner</h1>
      <p className="login-subtitle">Plan your day, achieve your goals.</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="auth-input"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        )}
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className="auth-input password-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="auth-button">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      {isLogin && (
        <div className="forgot-container">
          {!showReset ? (
            <button className="forgot-link" onClick={() => setShowReset(true)}>Forgot password?</button>
          ) : (
            <form onSubmit={handleForgot} className="reset-form">
              <input
                type="email"
                placeholder="Enter your account email"
                className="auth-input"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <div className="reset-actions">
                <button type="button" className="auth-button secondary" onClick={() => setShowReset(false)}>Cancel</button>
                <button type="submit" className="auth-button">Send reset link</button>
              </div>
            </form>
          )}
        </div>
      )}
      
      <p className="toggle-auth">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Sign In'}
        </span>
      </p>
    </div>
  );
};

export default Login;