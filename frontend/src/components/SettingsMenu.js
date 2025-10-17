import React, { useEffect, useRef, useState } from 'react';
import { Settings, User, LogOut, Moon, Sun, Mail, Key, X } from 'lucide-react';

const SettingsMenu = ({
  user,
  isDark,
  onToggleTheme,
  onLogout,
  onChangeEmail,
  onChangePassword,
}) => {
  const [open, setOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setEmail(user?.email || '');
  }, [user]);

  const toggle = () => setOpen(v => !v);

  const submitEmail = async (e) => {
    e.preventDefault();
    await onChangeEmail?.(email);
    setShowEmailModal(false);
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    await onChangePassword?.({ currentPassword, newPassword, reNewPassword });
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setReNewPassword('');
  };

  return (
    <div className="settings-menu-container" ref={containerRef}>
      <button className="settings-button" onClick={toggle} aria-label="Open settings">
        <User size={22} />
      </button>

      {open && (
        <div className="settings-dropdown">
          <div className="settings-header">
            <div className="settings-user">
              <User size={18} />
              <span>{user?.username || 'User'}</span>
            </div>
          </div>
          <button className="settings-item" onClick={() => { setShowEmailModal(true); setOpen(false); }}>
            <Mail size={18} />
            <span>Change email</span>
          </button>
          <button className="settings-item" onClick={() => { setShowPasswordModal(true); setOpen(false); }}>
            <Key size={18} />
            <span>Change password</span>
          </button>
          <button className="settings-item" onClick={() => { onToggleTheme?.(); setOpen(false); }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          {/* Lemon themes removed per request */}
          <div className="settings-separator" />
          <button className="settings-item danger" onClick={() => { onLogout?.(); setOpen(false); }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setShowEmailModal(false)}><X size={20} /></button>
            <h3 className="modal-title">Change email</h3>
            <form onSubmit={submitEmail}>
              <div className="form-group">
                <label>New email</label>
                <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button className="modal-submit-button" type="submit">Update email</button>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setShowPasswordModal(false)}><X size={20} /></button>
            <h3 className="modal-title">Change password</h3>
            <form onSubmit={submitPassword}>
              <div className="form-group">
                <label>Current password</label>
                <input className="form-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>New password</label>
                <input className="form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm new password</label>
                <input className="form-input" type="password" value={reNewPassword} onChange={(e) => setReNewPassword(e.target.value)} required />
              </div>
              <button className="modal-submit-button" type="submit">Update password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;







