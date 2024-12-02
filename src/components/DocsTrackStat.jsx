import React from "react";
import { Check, FileInput } from "lucide-react";

const DocsTrackStat = ({ status = "" }) => {
  const orderStatuses = [
    { id: "1", label: "Documents Uploaded", icon: FileInput },
    { id: "2", label: "Payment Processing", icon: FileInput },
    { id: "3", label: "Documents Under Review", icon: FileInput },
    { id: "4", label: "Documents Verified", icon: FileInput },
  ];

  const isStatusActive = (currentStatus, targetStatus) => {
    const currentIndex = orderStatuses.findIndex((s) => s.id === currentStatus);
    const targetIndex = orderStatuses.findIndex((s) => s.id === targetStatus);

    return currentIndex >= targetIndex;
  };

  const currentStatusLabel =
    orderStatuses.find((s) => s.id === status)?.label || "Unknown Status";

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg">
      <div className="flex items-center justify-between">
        {orderStatuses.map((orderStatus, index) => {
          const isActive = isStatusActive(status, orderStatus.id);
          const StatusIcon = isActive ? Check : orderStatus.icon;
          const isLast = index === orderStatuses.length - 1;

          return (
            <React.Fragment key={orderStatus.id}>
              <div className="flex flex-col items-center">
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
                  className={`h-1 flex-grow mx-2 transition duration-200 ease-in-out ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Current Status: {currentStatusLabel}
      </p>
    </div>
  );
};

export default DocsTrackStat;
