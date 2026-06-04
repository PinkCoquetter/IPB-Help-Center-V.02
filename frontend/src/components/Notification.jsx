import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const NotificationBanner = ({ type = 'success', message }) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: <HiOutlineCheckCircle />
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: <HiOutlineExclamationCircle />
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <HiOutlineExclamationCircle />
    }
  };

  const style = styles[type];

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
      flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-sm
      ${style.bg} ${style.text} ${style.border}
    `}>
      <span className="text-xl">{style.icon}</span>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
};

export default NotificationBanner;