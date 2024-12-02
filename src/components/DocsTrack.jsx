import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DocsTrackStat from "./DocsTrackStat";

const DocsTrack = () => {
  const [expandedHistories, setExpandedHistories] = useState({});

  const orderStatuses = [
    { id: "1", label: "Documents Uploaded" },
    { id: "2", label: "Payment Processing" },
    { id: "3", label: "Documents Under Review" },
    { id: "4", label: "Documents Verified" },
  ];

  const shipments = [
    {
      id: "1",
      status: "2",
      date: "Saturday 09/28/2024 at 11:29 p.m.",
      docstype: "Income Certificate",
      history: [
        {
          date: "Friday, 09/27/2024",
          time: "10:45 a.m.",
          location: "All Documents Uploaded",
        },
        {
          date: "Friday, 09/27/2024",
          time: "10:53 a.m.",
          location: "Documents Under Review",
        },
      ],
    },
    {
      id: "2",
      status: "3",
      date: "Saturday 09/28/2024 at 11:29 p.m.",
      docstype: "Aadhar Card",
      history: [
        {
          date: "Friday, 09/27/2024",
          time: "10:45 a.m.",
          location: "All Documents Uploaded",
        },
        {
          date: "Friday, 09/27/2024",
          time: "10:53 a.m.",
          location: "Documents Under Review",
        },
        {
          date: "Saturday, 09/28/2024",
          time: "10:30 a.m.",
          location: "Documents Verified",
        },
      ],
    },
  ];

  const toggleHistory = (id) => {
    setExpandedHistories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Track Submission Status
      </h1>
      {shipments.map((shipment) => {
        const statusLabel = orderStatuses.find(
          (status) => status.id === shipment.status
        )?.label;

        const isHistoryExpanded = expandedHistories[shipment.id] || false;

        return (
          <div key={shipment.id} className=" mb-6 border rounded-lg p-4">
            <div className="mt-4 flex justify-between mb-4">
              <div>
                <p className="text-xl  font-semibold">Document Name:</p>
                <p className="text-xl">{shipment.docstype}</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold">{statusLabel}</h2>
              <p className="text-gray-600">{shipment.date}</p>
            </div>
            <DocsTrackStat status={shipment.status} />
            <div className="mt-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleHistory(shipment.id)}
              >
                <h3 className="font-semibold">History</h3>
                {isHistoryExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {isHistoryExpanded && (
                <div className="mt-2">
                  {shipment.history.map((event, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-semibold">{event.date}</p>
                      <p>
                        {event.time} - {event.location || "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocsTrack;
