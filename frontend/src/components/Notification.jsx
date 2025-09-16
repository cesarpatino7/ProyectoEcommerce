import React, { useState, useEffect } from "react";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  if (!message) return null;

  const baseClasses = "alert shadow-lg";
  const typeClasses = {
    success: "alert-success",
    error: "alert-error",
  };

  return (
    <div className="toast toast-top toast-center z-[9999]">
      <div className={`${baseClasses} ${typeClasses[type]}`}>
        <div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Notification;
