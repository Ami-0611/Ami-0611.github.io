import React, { useState } from "react";
import ManageDataModal from "./ManageDataModal";

const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  breeds,
  rescueTypes,
  onAddBreed,
  onEditBreed,
  onDeleteBreed,
  onAddRescueType,
  onEditRescueType,
  onDeleteRescueType,
}) => {
  const [isBreedModalOpen, setIsBreedModalOpen] = useState(false);
  const [isRescueTypeModalOpen, setIsRescueTypeModalOpen] = useState(false);
  const ageGroups = ["young", "adult", "senior"];
  const colors = [
    "Black",
    "Brown",
    "White",
    "Tan",
    "Gray",
    "Red",
    "Blue",
    "Yellow",
  ];
  const sexes = [
    "Intact Male",
    "Intact Female",
    "Neutered Male",
    "Spayed Female",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onClearFilters}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="breed-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Breed:
            </label>
            <button
              onClick={() => setIsBreedModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              Manage
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              id="breed-filter"
              value={filters.breed}
              onChange={(e) => onFilterChange("breed", e.target.value)}
              placeholder="Search by breed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {filters.breed && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => onFilterChange("breed", "")}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="age-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Age Group:
          </label>
          <select
            id="age-filter"
            value={filters.age}
            onChange={(e) => onFilterChange("age", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Ages</option>
            {ageGroups.map((age) => (
              <option key={age} value={age}>
                {age === "young"
                  ? "Young (≤6 months)"
                  : age === "adult"
                  ? "Adult (6 months - 2 years)"
                  : "Senior (2+ years)"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="color-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Color:
          </label>
          <select
            id="color-filter"
            value={filters.color}
            onChange={(e) => onFilterChange("color", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Colors</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sex-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sex:
          </label>
          <select
            id="sex-filter"
            value={filters.sex}
            onChange={(e) => onFilterChange("sex", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            {sexes.map((sex) => (
              <option key={sex} value={sex}>
                {sex}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="outcome-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Outcome:
          </label>
          <select
            id="outcome-filter"
            value={filters.outcome}
            onChange={(e) => onFilterChange("outcome", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Outcomes</option>
            <option value="Adoption">Adoption</option>
            <option value="Return to Owner">Return to Owner</option>
            <option value="Transfer">Transfer</option>
            <option value="Euthanasia">Euthanasia</option>
            <option value="Died">Died</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="rescue-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Rescue Type:
            </label>
            <button
              onClick={() => setIsRescueTypeModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              Manage
            </button>
          </div>
          <select
            id="rescue-filter"
            value={filters.rescueType}
            onChange={(e) => onFilterChange("rescueType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {rescueTypes && rescueTypes.length > 0 ? (
              rescueTypes.map((type) => (
                <option
                  key={type.id || type._id || type.name}
                  value={type.name}
                >
                  {type.name}
                </option>
              ))
            ) : (
              // Fallback to static options if no data from API
              <>
                <option value="water">Water Rescue</option>
                <option value="mountain">Mountain Rescue</option>
                <option value="disaster">Disaster Rescue</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Manage Data Modals */}
      <ManageDataModal
        isOpen={isBreedModalOpen}
        onClose={() => {
          setIsBreedModalOpen(false);
          // Refresh breeds data after modal is closed
          setTimeout(() => {
            // This will trigger a refresh in the parent component
          }, 100);
        }}
        dataType="breed"
        data={breeds}
        onAdd={onAddBreed}
        onEdit={onEditBreed}
        onDelete={onDeleteBreed}
      />

      <ManageDataModal
        isOpen={isRescueTypeModalOpen}
        onClose={() => {
          setIsRescueTypeModalOpen(false);
          // Refresh rescue types data after modal is closed
          setTimeout(() => {
            // This will trigger a refresh in the parent component
          }, 100);
        }}
        dataType="rescueType"
        data={rescueTypes}
        onAdd={onAddRescueType}
        onEdit={onEditRescueType}
        onDelete={onDeleteRescueType}
      />
    </div>
  );
};

export default FilterPanel;
