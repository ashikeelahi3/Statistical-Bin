"use client"

import React from 'react';

interface ToastNotificationProps {
  message: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-3 py-2 rounded shadow-lg flex items-center transition-opacity duration-500 text-sm">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      {message}
    </div>
  );
};

export default ToastNotification;
