import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDone } from "react-icons/md";

const initialNotifications = [
  {
    id: 1,
    title: "📚 New Book Added",
    message: "'The Alchemist' is now available!",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    title: "💡 Recommended for You",
    message: "Check out 'Atomic Habits' based on your reading history.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 3,
    title: "🔥 Trending Now",
    message: "'Rich Dad Poor Dad' is gaining popularity!",
    time: "5 min ago",
    read: false,
  },
];

const Notification = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) => 
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          🔔 Notifications
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500"
          title="Close"
        >
          <IoMdClose size={20} />
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`relative bg-gray-100 dark:bg-gray-700 p-3 rounded-md border-l-4 ${
                notif.read ? "border-green-500 opacity-70" : "border-blue-500"
              }`}
            >
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {notif.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {notif.message}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {notif.time}
              </span>

              <div className="absolute top-2 right-2 flex gap-2">
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-green-500 hover:text-green-600"
                    title="Mark as read"
                  >
                    <MdDone size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Delete"
                >
                  <IoMdClose size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center">
            No notifications available
          </p>
        )}
      </div>

      {notifications.length > 0 && (
        <button
          onClick={clearAll}
          className="mt-4 w-full text-sm text-red-500 hover:text-red-600"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default Notification;