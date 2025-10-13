import React, { createContext, useContext, useCallback, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  const show = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const clear = useCallback(() => setNotification({ message: '', type: 'success' }), []);

  return (
    <NotificationContext.Provider value={{ show, clear }}>
      {children}
      <Notification message={notification.message} type={notification.type} onClose={clear} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationContext;
