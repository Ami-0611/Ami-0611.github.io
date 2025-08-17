import React from "react";

const Dashboard = ({ totalDogs, filteredDogs }) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="flex space-x-4">
        <div className="bg-white rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-100 rounded-full flex items-center justify-center text-white text-sm">
                📊
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                Total Dogs
              </h3>
              <p className="text-lg font-bold text-gray-900">{totalDogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-100 rounded-full flex items-center justify-center text-white text-sm">
                🔍
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                Filtered Results
              </h3>
              <p className="text-lg font-bold text-gray-900">{filteredDogs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
