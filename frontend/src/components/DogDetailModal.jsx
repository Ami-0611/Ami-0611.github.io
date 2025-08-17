import React, { useState } from "react";
import Snackbar from "./Snackbar";

const DogDetailModal = ({ dog, isOpen, onClose, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDog, setEditedDog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });
  if (!isOpen || !dog) return null;

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ message, type, isVisible: true });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, isVisible: false });
  };

  const handleEdit = () => {
    setEditedDog({ ...dog });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedDog) return;

    try {
      setIsLoading(true);
      await onEdit(editedDog.id || editedDog.animal_id, editedDog);
      setIsEditing(false);
      setEditedDog(null);
      showSnackbar("Dog information updated successfully!", "success");
      // Close modal after successful update
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      showSnackbar(
        err.message || "Failed to update dog information. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDog(null);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this dog? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        await onDelete(dog.id || dog.animal_id);
        showSnackbar("Dog deleted successfully!", "success");
        onClose();
      } catch (err) {
        showSnackbar(
          err.message || "Failed to delete dog. Please try again.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format age for display
  const formatAge = (weeks) => {
    if (!weeks) return "Unknown";
    const weeksNum = Math.floor(weeks);
    const years = Math.floor(weeksNum / 52);
    const remainingWeeks = weeksNum % 52;

    if (years > 0 && remainingWeeks > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${remainingWeeks} week${
        remainingWeeks > 1 ? "s" : ""
      }`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else {
      return `${weeksNum} week${weeksNum > 1 ? "s" : ""}`;
    }
  };

  // Get status color for outcome
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {dog.name && dog.name.trim() ? dog.name : "Unnamed Dog"} -{" "}
            {dog.animal_id}
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDog?.name || ""}
                        onChange={(e) =>
                          setEditedDog({ ...editedDog, name: e.target.value })
                        }
                        className="text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-800">
                        {dog.name && dog.name.trim() ? dog.name : "Unknown"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Animal ID:
                    </span>
                    <span className="text-gray-800">{dog.animal_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Breed:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDog?.breed || ""}
                        onChange={(e) =>
                          setEditedDog({ ...editedDog, breed: e.target.value })
                        }
                        className="text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-800">
                        {dog.breed || "Unknown"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Color:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDog?.color || ""}
                        onChange={(e) =>
                          setEditedDog({ ...editedDog, color: e.target.value })
                        }
                        className="text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-800">
                        {dog.color || "Unknown"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Age:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedDog?.age_upon_outcome_in_weeks || ""}
                        onChange={(e) =>
                          setEditedDog({
                            ...editedDog,
                            age_upon_outcome_in_weeks: e.target.value,
                          })
                        }
                        className="text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Weeks"
                      />
                    ) : (
                      <span className="text-gray-800">
                        {formatAge(dog.age_upon_outcome_in_weeks)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Sex:</span>
                    {isEditing ? (
                      <select
                        value={editedDog?.sex_upon_outcome || ""}
                        onChange={(e) =>
                          setEditedDog({
                            ...editedDog,
                            sex_upon_outcome: e.target.value,
                          })
                        }
                        className="text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Sex</option>
                        <option value="Intact Male">Intact Male</option>
                        <option value="Intact Female">Intact Female</option>
                        <option value="Neutered Male">Neutered Male</option>
                        <option value="Spayed Female">Spayed Female</option>
                      </select>
                    ) : (
                      <span className="text-gray-800">
                        {dog.sex_upon_outcome || "Unknown"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Date of Birth:
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={
                          editedDog?.date_of_birth
                            ? editedDog.date_of_birth.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setEditedDog({
                            ...editedDog,
                            date_of_birth: e.target.value,
                          })
                        }
                        className="text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-800">
                        {formatDate(dog.date_of_birth)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Outcome Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Outcome Type:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        dog.outcome_type
                      )}`}
                    >
                      {dog.outcome_type || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Outcome Subtype:
                    </span>
                    <span className="text-gray-800">
                      {dog.outcome_subtype || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Date:</span>
                    <span className="text-gray-800">
                      {formatDate(dog.datetime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Rescue Type:
                    </span>
                    <span className="text-gray-800 capitalize">
                      {dog.rescue_type || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Location Map */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Location Information
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Latitude:</span>
                    <span className="text-gray-800">
                      {dog.location_lat || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Longitude:
                    </span>
                    <span className="text-gray-800">
                      {dog.location_long || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Map Container */}
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  {dog.location_lat && dog.location_long ? (
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${dog.location_lat},${dog.location_long}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Location of ${dog.name || "Dog"}`}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium">
                        Location Not Available
                      </p>
                      <p className="text-sm">
                        GPS coordinates are not available for this dog
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Animal Type:
                    </span>
                    <span className="text-gray-800">
                      {dog.animal_type || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Month/Year:
                    </span>
                    <span className="text-gray-800">
                      {dog.monthyear || "Unknown"}
                    </span>
                  </div>
                  {dog.description && (
                    <div>
                      <span className="font-medium text-gray-600 block mb-2">
                        Description:
                      </span>
                      <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded">
                        {dog.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Close
            </button>
          )}
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

export default DogDetailModal;
