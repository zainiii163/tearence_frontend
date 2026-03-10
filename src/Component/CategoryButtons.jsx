import React from "react";
import { Link } from "react-router-dom";
import {
  FaHandshake,
  FaCar,
  FaHome,
  FaBriefcase,
  FaPlane,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBook,
  FaChartLine,
  FaRocket,
  FaStar,
  FaMedal,
  FaBullhorn,
} from "react-icons/fa";
import { PiFlagBanner } from "react-icons/pi";

const CategoryButtons = () => {
  // Test version to ensure component renders
  return (
    <div className="w-full bg-red-500 py-8 px-4 text-white text-center font-bold text-xl">
      CATEGORY BUTTONS TEST - If you see this, the component is working!
      <div className="max-w-7xl mx-auto mt-4">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
          <button className="bg-white text-red-500 px-4 py-2 rounded">Services</button>
          <button className="bg-white text-red-500 px-4 py-2 rounded">Vehicles</button>
          <button className="bg-white text-red-500 px-4 py-2 rounded">Property</button>
          <button className="bg-white text-red-500 px-4 py-2 rounded">Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryButtons;
