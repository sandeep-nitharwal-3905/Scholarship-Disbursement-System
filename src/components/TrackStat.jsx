import React from "react";
import { Check, FileInput } from "lucide-react";

const TrackStat = ({ status = "" }) => {
  const orderStatuses = [
    { id: "1", label: "All Documents Uploaded", icon: FileInput },
    { id: "2", label: "xyz1", icon: FileInput },
    { id: "3", label: "xyz2", icon: FileInput },
    { id: "4", label: "xyz3", icon: FileInput },
    { id: "5", label: "xyz4", icon: FileInput },
  ];

  const isStatusActive = (currentStatus, targetStatus) => {
    const currentIndex = orderStatuses.findIndex((s) => s.id === currentStatus);
    const targetIndex = orderStatuses.findIndex((s) => s.id === targetStatus);

    return currentIndex >= targetIndex;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Document Status Tracker
      </h1>

      <div className="flex items-center justify-between relative">
        {orderStatuses.map((orderStatus, index) => {
          const isActive = isStatusActive(status, orderStatus.id);
          const StatusIcon = isActive ? Check : orderStatus.icon;
          const isLast = index === orderStatuses.length - 1;

          return (
            <React.Fragment key={orderStatus.id}>
              <div className="flex flex-col items-center z-10">
                <div
                  className={`rounded-full p-3 transition duration-200 ease-in-out transform hover:scale-105 ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <StatusIcon
                    className={`w-8 h-8 transition duration-200 ease-in-out ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                </div>
                <p
                  className={`mt-2 text-sm text-center font-medium transition duration-200 ease-in-out ${
                    isActive ? "text-black" : "text-gray-400"
                  }`}
                >
                  {orderStatus.label}
                </p>
              </div>
              {!isLast && (
                <div
                  className={`h-1 flex-grow transition duration-200 ease-in-out ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                  style={{
                    position: "absolute",
                    left: `${(100 / (orderStatuses.length - 1)) * index}%`,
                    right: `${
                      100 - (100 / (orderStatuses.length - 1)) * (index + 1)
                    }%`,
                    top: "28px",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Current Status: {status}
      </p>
    </div>
  );
};

export default TrackStat;
