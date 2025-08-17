import React, { useState } from "react";
import Snackbar from "./Snackbar";

const AddDogModal = ({ isOpen, onClose, onAdd }) => {
  const [newDog, setNewDog] = useState({
    name: "",
    animal_id: "",
    animal_type: "Dog",
    breed: "",
    color: "",
    age_upon_outcome_in_weeks: "",
    sex_upon_outcome: "",
    date_of_birth: "",
    datetime: new Date().toISOString().split("T")[0],
    outcome_type: "Adoption",
    outcome_subtype: "",
    rescue_type: "",
    location_lat: 0,
    location_long: 0,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ message, type, isVisible: true });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, isVisible: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDog.name.trim() || !newDog.animal_id.trim()) {
      showSnackbar("Name and Animal ID are required", "error");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for API - ensure all fields are properly formatted
      const dogData = {
        ...newDog,
        // Ensure numeric fields are numbers
        age_upon_outcome_in_weeks: newDog.age_upon_outcome_in_weeks
          ? parseFloat(newDog.age_upon_outcome_in_weeks)
          : 0,
        location_lat: parseFloat(newDog.location_lat) || 0,
        location_long: parseFloat(newDog.location_long) || 0,
        // Ensure date fields are strings
        date_of_birth: newDog.date_of_birth || "",
        datetime: newDog.datetime || new Date().toISOString().split("T")[0],
      };

      await onAdd(dogData);
      showSnackbar("Dog added successfully!", "success");
      // Reset form
      setNewDog({
        name: "",
        animal_id: "",
        animal_type: "Dog",
        breed: "",
        color: "",
        age_upon_outcome_in_weeks: "",
        sex_upon_outcome: "",
        date_of_birth: "",
        datetime: new Date().toISOString().split("T")[0],
        outcome_type: "Adoption",
        outcome_subtype: "",
        rescue_type: "",
        location_lat: 0,
        location_long: 0,
        description: "",
      });
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      showSnackbar(
        err.message || "Failed to add dog. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewDog((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Dog</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newDog.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal ID *
                </label>
                <input
                  type="text"
                  value={newDog.animal_id}
                  onChange={(e) =>
                    handleInputChange("animal_id", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Type
                </label>
                <input
                  type="text"
                  value={newDog.animal_type}
                  onChange={(e) =>
                    handleInputChange("animal_type", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  value={newDog.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={newDog.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (weeks)
                </label>
                <input
                  type="number"
                  value={newDog.age_upon_outcome_in_weeks}
                  onChange={(e) =>
                    handleInputChange(
                      "age_upon_outcome_in_weeks",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sex
                </label>
                <select
                  value={newDog.sex_upon_outcome}
                  onChange={(e) =>
                    handleInputChange("sex_upon_outcome", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sex</option>
                  <option value="Intact Male">Intact Male</option>
                  <option value="Intact Female">Intact Female</option>
                  <option value="Neutered Male">Neutered Male</option>
                  <option value="Spayed Female">Spayed Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newDog.date_of_birth}
                  onChange={(e) =>
                    handleInputChange("date_of_birth", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date/Time
                </label>
                <input
                  type="date"
                  value={newDog.datetime}
                  onChange={(e) =>
                    handleInputChange("datetime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome Type
                </label>
                <select
                  value={newDog.outcome_type}
                  onChange={(e) =>
                    handleInputChange("outcome_type", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Adoption">Adoption</option>
                  <option value="Return to Owner">Return to Owner</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Euthanasia">Euthanasia</option>
                  <option value="Died">Died</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome Subtype
                </label>
                <input
                  type="text"
                  value={newDog.outcome_subtype}
                  onChange={(e) =>
                    handleInputChange("outcome_subtype", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rescue Type
                </label>
                <input
                  type="text"
                  value={newDog.rescue_type}
                  onChange={(e) =>
                    handleInputChange("rescue_type", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={newDog.location_lat}
                  onChange={(e) =>
                    handleInputChange(
                      "location_lat",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={newDog.location_long}
                  onChange={(e) =>
                    handleInputChange(
                      "location_long",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newDog.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 space-x-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {isLoading ? "Adding..." : "Add Dog"}
          </button>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
        duration={5000}
      />
    </div>
  );
};

export default AddDogModal;
