import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import TrackStat from "./TrackStat";

const ShipmentTracker = () => {
  const [expandedHistories, setExpandedHistories] = useState({});

  const orderStatuses = [
    { id: "1", label: "All Documents Uploaded" },
    { id: "2", label: "Documents Under Review" },
    { id: "3", label: "Documents Verified" },
    { id: "4", label: "Payment Processing" },
    { id: "5", label: "Scholarship Disbursed" },
  ];

  const shipments = [
    {
      id: "1",
      status: "1",
      date: "Saturday 12/29/2018 at 11:28 am",
      docstype: "Aadhar Card",
      history: [
        {
          date: "Saturday, 12/29/2018",
          time: "11:28 am",
          status: "Delivered",
        },
        {
          date: "Saturday, 12/29/2018",
          time: "4:35 am",
          status: "idk1",
        },
      ],
    },
    {
      id: "2",
      status: "3",
      date: "Saturday 12/29/2018 at 11:28 am",
      docstype: "xyz Card",
      history: [
        {
          date: "Saturday, 12/29/2018",
          time: "11:28 am",
          status: "Delivered",
        },
        {
          date: "Saturday, 12/29/2018",
          time: "4:35 am",
          status: "idk1",
        },
      ],
    },
    {
      id: "3",
      status: "5",
      date: "Saturday 12/29/2018 at 11:28 am",
      docstype: "Card 69",
      history: [
        {
          date: "Saturday, 12/29/2018",
          time: "11:28 am",
          status: "Delivered",
        },
        {
          date: "Saturday, 12/29/2018",
          time: "4:35 am",
          status: "idk1",
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
            <TrackStat status={shipment.status} />
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

export default ShipmentTracker;
