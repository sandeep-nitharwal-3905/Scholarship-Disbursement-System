import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const NewTopBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    { label: "Home", items: [] },
    { label: "About", items: [] },
    { label: "How To Apply", items: [] },
    {
      label: "Downloads",
      items: [
        "Income Certificate",
        "User Manual",
        "User Manual For Non-NET",
        "HDI Forwarding Letter Format(For Board Toppers)",
        "GUIDELINES",
        "TR FORM 7",
      ],
    },
    { label: "Contacts", items: [] },
    { label: "Weblinks", items: [] },
    { label: "Emergency Relief Fund", items: [] },
  ];

  return (
    <div className="bg-gray-900 text-white w-full shadow-md">
      <div className="container mx-auto py-2">
        <ul className="flex flex-wrap justify-between">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="#"
                className="block px-5 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 group-hover:text-blue-300 rounded-md"
              >
                {item.label}
                {item.items.length > 0 && (
                  <ChevronDown
                    className="inline-block ml-2 group-hover:transform group-hover:rotate-180 transition-transform duration-200"
                    size={16}
                  />
                )}
              </a>
              {item.items.length > 0 && activeDropdown === index && (
                <ul className="absolute left-0 mt-1 w-56 bg-white text-gray-800 shadow-lg rounded-md overflow-hidden z-10">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href="#"
                        className="block px-5 py-3 text-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                      >
                        {subItem}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewTopBar;
