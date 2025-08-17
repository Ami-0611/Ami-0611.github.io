import React, { useState, useEffect } from "react";
import apiService from "../services/api";
import DogDetailModal from "./DogDetailModal";
import AddDogModal from "./AddDogModal";

const DogList = ({ dogs: initialDogs, onDogsUpdate }) => {
  const [dogs, setDogs] = useState(initialDogs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDog, setSelectedDog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 7;

  // Update dogs when initialDogs prop changes
  useEffect(() => {
    if (initialDogs && initialDogs.length > 0) {
      console.log("Setting dogs from props:", initialDogs.slice(0, 3)); // Debug first 3 dogs
      setDogs(initialDogs);
      setLoading(false);
      setError(null);
      setCurrentPage(1); // Reset to first page when filters change
    } else if (!initialDogs || initialDogs.length === 0) {
      // Only fetch from API if no dogs are provided
      const fetchDogs = async () => {
        setLoading(true);
        setError(null);
        try {
          const dogsData = await apiService.getDogs();
          console.log("Fetched dogs from API:", dogsData.slice(0, 3)); // Debug first 3 dogs
          setDogs(dogsData);
        } catch (err) {
          setError("Failed to fetch dogs from API");
          console.error("Error fetching dogs:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDogs();
    }
  }, [initialDogs]);

  // Sorting function
  const sortedDogs = [...dogs].sort((a, b) => {
    let aValue = a[sortBy] || "";
    let bValue = b[sortBy] || "";

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDogs = sortedDogs.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewDetails = (dog) => {
    setSelectedDog(dog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDog(null);
  };

  const handleEditDog = async (id, dogData) => {
    try {
      const result = await apiService.updateDog(id, dogData);
      // Update the dog in local state
      const updatedDogs = dogs.map((dog) =>
        (dog.id || dog.animal_id) === id ? { ...dog, ...dogData } : dog
      );
      setDogs(updatedDogs);
      // Notify parent component about the update
      if (onDogsUpdate) {
        onDogsUpdate(updatedDogs);
      }
      return result;
    } catch (error) {
      console.error("Error updating dog:", error);
      throw error;
    }
  };

  const handleDeleteDog = async (id) => {
    try {
      const result = await apiService.deleteDog(id);
      // Remove the dog from local state
      const updatedDogs = dogs.filter(
        (dog) => (dog.id || dog.animal_id) !== id
      );
      setDogs(updatedDogs);
      // Notify parent component about the update
      if (onDogsUpdate) {
        onDogsUpdate(updatedDogs);
      }
      // Close modal after successful deletion
      setIsModalOpen(false);
      setSelectedDog(null);
      return result;
    } catch (error) {
      console.error("Error deleting dog:", error);
      throw error;
    }
  };

  const handleAddDog = async (dogData) => {
    try {
      const result = await apiService.addDog(dogData);
      // Add the new dog to local state
      const updatedDogs = [...dogs, { ...dogData, id: result.id }];
      setDogs(updatedDogs);
      // Notify parent component about the update
      if (onDogsUpdate) {
        onDogsUpdate(updatedDogs);
      }
      return result;
    } catch (error) {
      console.error("Error adding dog:", error);
      throw error;
    }
  };

  const getStatusColor = (outcome) => {
    switch (outcome?.toLowerCase()) {
      case "adoption":
        return "bg-green-100 text-green-800";
      case "transfer":
        return "bg-blue-100 text-blue-800";
      case "return to owner":
        return "bg-yellow-100 text-yellow-800";
      case "euthanasia":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading dogs...
          </h3>
          <p className="text-gray-600">Fetching data from the API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Error loading dogs
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No dogs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b-2 border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">
          🐕.. Dog List
        </h2>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="name">Name</option>
            <option value="breed">Breed</option>
            <option value="age_upon_outcome_in_weeks">Age</option>
            <option value="color">Color</option>
            <option value="sex_upon_outcome">Sex</option>
            <option value="outcome_type">Outcome</option>
            <option value="rescue_type">Rescue Type</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Dog</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-50">
              <th
                onClick={() => handleSort("name")}
                className="w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Name
              </th>
              <th
                onClick={() => handleSort("breed")}
                className="w-48 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Breed
              </th>
              <th
                onClick={() => handleSort("age_upon_outcome_in_weeks")}
                className="w-20 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Age
              </th>
              <th
                onClick={() => handleSort("color")}
                className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Color
              </th>
              <th
                onClick={() => handleSort("sex_upon_outcome")}
                className="w-36 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Sex
              </th>
              <th
                onClick={() => handleSort("outcome_type")}
                className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Outcome
              </th>
              <th
                onClick={() => handleSort("rescue_type")}
                className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Rescue Type
              </th>
              <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDogs.map((dog, index) => (
              <tr
                key={dog._id || index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td
                  className="px-4 py-3 text-sm text-gray-900 truncate"
                  title={dog.name && dog.name.trim() ? dog.name : "Unknown"}
                >
                  {dog.name && dog.name.trim() ? dog.name : "Unknown"}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 truncate"
                  title={dog.breed || "Unknown"}
                >
                  {dog.breed || "Unknown"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {dog.age_upon_outcome_in_weeks
                    ? (() => {
                        const weeks = Math.floor(dog.age_upon_outcome_in_weeks);
                        const years = Math.floor(weeks / 52);
                        const remainingWeeks = weeks % 52;

                        if (years > 0 && remainingWeeks > 0) {
                          return `${years}y ${remainingWeeks}w`;
                        } else if (years > 0) {
                          return `${years}y`;
                        } else {
                          return `${weeks}w`;
                        }
                      })()
                    : "Unknown"}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 truncate"
                  title={dog.color || "Unknown"}
                >
                  {dog.color || "Unknown"}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 truncate"
                  title={dog.sex_upon_outcome || "Unknown"}
                >
                  {dog.sex_upon_outcome || "Unknown"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(
                      dog.outcome_type
                    )}`}
                    title={dog.outcome_type || "Unknown"}
                  >
                    {dog.outcome_type === "Return to Owner"
                      ? "Return"
                      : dog.outcome_type || "Unknown"}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-900 truncate"
                  title={dog.rescue_type || "Unknown"}
                >
                  {dog.rescue_type || "Unknown"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(dog)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6 pt-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-md border transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <svg
              className="w-4 h-4 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Numbers */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              // Show all pages if total is small
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              // Show first page
              pages.push(1);

              if (currentPage <= 3) {
                // Near the beginning
                pages.push(2);
                if (totalPages > 3) pages.push("...");
                pages.push(totalPages - 1);
                pages.push(totalPages);
              } else if (currentPage >= totalPages - 2) {
                // Near the end
                pages.push("...");
                pages.push(totalPages - 2);
                pages.push(totalPages - 1);
                pages.push(totalPages);
              } else {
                // In the middle
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
              }
            }

            return pages.map((page, index) => (
              <button
                key={index}
                onClick={() => {
                  if (typeof page === "number") {
                    setCurrentPage(page);
                  }
                }}
                disabled={page === "..."}
                className={`w-10 h-10 rounded-md border text-sm font-bold transition-colors ${
                  page === currentPage
                    ? "bg-green-600 text-white border-green-600"
                    : page === "..."
                    ? "bg-white text-gray-600 border-gray-300 cursor-default"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ));
          })()}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-md border transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <svg
              className="w-4 h-4 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Dog Detail Modal */}
      <DogDetailModal
        dog={selectedDog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditDog}
        onDelete={handleDeleteDog}
      />

      {/* Add Dog Modal */}
      <AddDogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDog}
      />
    </div>
  );
};

export default DogList;
