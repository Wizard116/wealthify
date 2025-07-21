import { useState, useEffect } from "react";
import axios from "axios";
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon, BellIcon } from "@heroicons/react/24/outline";

const getUnreadMessageCount = (size) => {
    let count = size;
    if (count > 99) {
        count = "99+";
    }
    return count;
}

const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
};
function NotificationSkeleton() {
    return (
      <div className="flex flex-col p-6 gap-3 bg-gray-100 drop-shadow rounded-lg animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-24 h-3 bg-gray-300 rounded"></div>
      </div>
    );
  }

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        
    ]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/notifications`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          // Introduce a delay of 2 seconds (2000 milliseconds)
          setTimeout(() => {
            if (response.data.filter(notification => !notification.read).length === 0) {
              setShowAll(true);
            }
            setNotifications(response.data);
            setLoading(false);
          }, 10); // Adjust the delay time as needed
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setLoading(false); // Make sure to set loading to false in case of an error as well
        }
      };
      

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${import.meta.env.VITE_BASE_URL}/api/notifications/system/readAll`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // After marking all notifications as read, refetch the notifications
            // fetchNotifications();
        } catch (error) {
            console.error("Error marking notifications as read:", error.message || error.response.data.message);
        }
    };
    markAllAsRead();
    return (
        <div className="flex flex-col p-6 gap-6 bg-white drop-shadow rounded-xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl">Audit Log</h2>
                <div className="flex items-center space-x-3">
                {notifications.length === 0 ? '' :
                        <>
                    <button
                        className={`text-xs md:text-sm font-semibold text-gray-800 py-2 px-4 rounded-md focus:outline-none transition-colors border border-gray-400 ${!showAll ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white hover:bg-gray-100"}`}
                        onClick={() => setShowAll(false)}
                    >
                        
                        Unread <span>({getUnreadMessageCount(notifications.filter(notification => !notification.read).length)})</span>
                    </button>
                    <button
                        className={`text-xs md:text-sm font-semibold text-gray-800 py-2 px-4 rounded-md focus:outline-none transition-colors border border-gray-400 ${showAll ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white hover:bg-gray-100"}`}
                        onClick={() => setShowAll(true)}
                        >
                        All
                    </button>
                        </>
                        }
                </div>
            </div>

            <hr className="border-2 border-b-2 rounded-sm" />

            {loading ? (
                <div className="scrollView overflow-y-auto h-[65vh] flex flex-col gap-4 snap-x">
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
                </div>
            ) : (
                <div className="scrollView overflow-y-auto h-[68vh] flex flex-col gap-4 snap-x">
                    {notifications.length === 0 ? 
                    (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-600 text-lg">No Logs Found</div>
                        </div>
                    ) : <>
                    {showAll ? (
                        <>
                            {notifications.map((notification, idx) => (
                                <NotificationItem key={idx} {...notification} />
                            ))}
                        </>
                    ) : (
                        <>
                            {notifications.filter(notification => !notification.read).map((notification, idx) => (
                                <NotificationItem key={idx} {...notification} />
                            ))}
                        </>
                    )}
                    </>}
                </div>
            )}
        </div>
    );
}

const NotificationItem = ({ type, message, timestamp }) => {
    let iconComponent;
    switch (type) {
        case "deleted":
            iconComponent = <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
            break;
        case "goal Completed":
            iconComponent = <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            break;
        case "update":
            iconComponent = <ArrowPathIcon className="h-5 w-5 text-blue-600" />;
            break;
        case "alert":
            iconComponent = <BellIcon className="h-5 w-5 text-yellow-600" />;
            break;
        default:
            iconComponent = null;
    }
    const getTypeColor = () => {
        switch (type) {
          case "alert":
            return "text-yellow-600";
          case "deleted":
            return "text-red-600";
          case "update":
            return "text-blue-600";
          default:
            return "text-green-600";
        }
      };

    return (
        <div className={`flex items-center p-4 mb-4 rounded-lg ${getTypeColor()} border border-gray-200`}>
      <div className="mr-4">{iconComponent}</div>
      <div className="flex flex-col flex-1">
        <div className="text-sm font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} {type === "deleted" ? "Transaction" : "Successfully"}</div>
        <div className="text-gray-700 text-xs">{getTimeAgo(timestamp)}</div>
        <div className="mt-2 text-gray-800">{message}</div>
      </div>
    </div>
    );
}

export default Notifications;
