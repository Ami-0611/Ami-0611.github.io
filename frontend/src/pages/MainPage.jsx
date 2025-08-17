import React, { useState } from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import DogList from "../components/DogList";
import FilterPanel from "../components/FilterPanel";
import GoogleMapComponent from "../components/GoogleMapComponent";
import DogDetailModal from "../components/DogDetailModal";
import { useData } from "../context/DataContext";
import apiService from "../services/api";

const MainPage = () => {
  const {
    dogs,
    filteredDogs,
    loading,
    dogsLoading,
    breedsLoading,
    rescueTypesLoading,
    error,
    stats,
    topBreeds,
    getPercentage,
    filters,
    setFilters,
    setDogs,
    dataInitialized,
    breeds,
    rescueTypes,
    fetchBreeds,
    fetchRescueTypes,
  } = useData();

  // View state: 'dashboard', 'statistics', or 'map'
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedDog, setSelectedDog] = useState(null);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    const emptyFilters = {
      age: "",
      color: "",
      sex: "",
      outcome: "",
      breed: "",
      rescueType: "",
    };
    setFilters(emptyFilters);
    localStorage.removeItem("dogFilters");
  };

  const handleMarkerClick = (dog) => {
    setSelectedDog(dog);
  };

  const closeModal = () => {
    setSelectedDog(null);
  };

  // Breed management functions
  const handleAddBreed = async (name) => {
    console.log("Adding breed:", name);

    try {
      const result = await apiService.addBreed({ name });
      console.log("Breed added successfully:", result);

      // Don't refresh breeds data immediately to prevent modal from closing
      // The modal will handle the local state update
      // await fetchBreeds(true);

      return result;
    } catch (error) {
      console.error("Error adding breed:", error);
      throw error;
    }
  };

  const handleEditBreed = async (id, name) => {
    console.log("Editing breed:", id, name);

    try {
      const result = await apiService.updateBreed(id, { name });
      console.log("Breed updated successfully:", result);

      // Don't refresh breeds data immediately to prevent modal from closing
      // The modal will handle the local state update
      // await fetchBreeds(true);

      return result;
    } catch (error) {
      console.error("Error updating breed:", error);
      throw error;
    }
  };

  const handleDeleteBreed = async (id) => {
    console.log("Deleting breed:", id);

    try {
      const result = await apiService.deleteBreed(id);
      console.log("Breed deleted successfully:", result);

      // Don't refresh breeds data immediately to prevent modal from closing
      // The modal will handle the local state update
      // await fetchBreeds(true);

      return result;
    } catch (error) {
      console.error("Error deleting breed:", error);
      throw error;
    }
  };

  // Rescue Type management functions
  const handleAddRescueType = async (name) => {
    console.log("Adding rescue type:", name);

    try {
      const result = await apiService.addRescueType({ name });
      console.log("Rescue type added successfully:", result);

      // Don't refresh rescue types data immediately to prevent modal from closing
      // The modal will handle the local state update
      // await fetchRescueTypes(true);

      return result;
    } catch (error) {
      console.error("Error adding rescue type:", error);
      throw error;
    }
  };

  const handleEditRescueType = async (id, name) => {
    console.log("Editing rescue type:", id, name);

    try {
      const result = await apiService.updateRescueType(id, { name });
      console.log("Rescue type updated successfully:", result);

      // Don't refresh rescue types data immediately to prevent modal from closing
      // The modal will handle the local state update
      // await fetchRescueTypes(true);

      return result;
    } catch (error) {
      console.error("Error updating rescue type:", error);
      throw error;
    }
  };

  const handleDeleteRescueType = async (id) => {
    console.log("Deleting rescue type:", id);

    try {
      const result = await apiService.deleteRescueType(id);
      console.log("Rescue type deleted successfully:", result);

      // Don't refresh rescue types data immediately to prevent modal from closing
      // The modal will handle the local state update
      // await fetchRescueTypes(true);

      return result;
    } catch (error) {
      console.error("Error deleting rescue type:", error);
      throw error;
    }
  };

  // Dog management functions
  const handleEditDog = async (id, dogData) => {
    console.log("Editing dog:", id, dogData);

    try {
      const result = await apiService.updateDog(id, dogData);
      console.log("Dog updated successfully:", result);

      // Update the dog in local state immediately
      setDogs((prevDogs) =>
        prevDogs.map((dog) =>
          (dog.id || dog.animal_id) === id ? { ...dog, ...dogData } : dog
        )
      );

      return result;
    } catch (error) {
      console.error("Error updating dog:", error);
      throw error;
    }
  };

  const handleDeleteDog = async (id) => {
    console.log("Deleting dog:", id);

    try {
      const result = await apiService.deleteDog(id);
      console.log("Dog deleted successfully:", result);

      // Remove the dog from local state immediately
      setDogs((prevDogs) =>
        prevDogs.filter((dog) => (dog.id || dog.animal_id) !== id)
      );

      return result;
    } catch (error) {
      console.error("Error deleting dog:", error);
      throw error;
    }
  };

  // Show loading only if we don't have any data yet
  if (loading && !dataInitialized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600 text-lg mb-2">Loading data...</p>
          <div className="text-sm text-gray-500 space-y-1">
            {dogsLoading && <div>🐕... Loading dogs data...</div>}
            {breedsLoading && <div>Loading breeds data...</div>}
            {rescueTypesLoading && <div>Loading rescue types data...</div>}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Show FilterPanel with loading state */}
          <aside className="lg:col-span-1 space-y-6">
            {!breedsLoading && !rescueTypesLoading ? (
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                breeds={breeds}
                rescueTypes={rescueTypes}
                onAddBreed={handleAddBreed}
                onEditBreed={handleEditBreed}
                onDeleteBreed={handleDeleteBreed}
                onAddRescueType={handleAddRescueType}
                onEditRescueType={handleEditRescueType}
                onDeleteRescueType={handleDeleteRescueType}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-8 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Show content based on current view */}
          <section className="lg:col-span-3">
            {/* Dashboard stats and View Toggle Buttons in a row */}
            <div className="flex justify-between items-center mb-6">
              {/* Dashboard stats */}
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
                      <p className="text-lg font-bold text-gray-900">
                        {dogs.length}
                      </p>
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
                      <p className="text-lg font-bold text-gray-900">
                        {filteredDogs.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Toggle Buttons */}
              <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentView === "dashboard"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView("statistics")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentView === "statistics"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Statistics
                </button>
                <button
                  onClick={() => setCurrentView("map")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentView === "map"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Map
                </button>
              </div>
            </div>

            {!dogsLoading ? (
              <>
                {currentView === "dashboard" && (
                  <DogList
                    dogs={filteredDogs}
                    onDogsUpdate={(updatedDogs) => {
                      // Update the dogs in the context
                      setDogs(updatedDogs);
                    }}
                  />
                )}

                {currentView === "statistics" && (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Total Dogs
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                              {stats.total}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Adoptions
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                              {stats.byOutcome["Adoption"] || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Return to Owner
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                              {stats.byOutcome["Return to Owner"] || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                              Unique Breeds
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                              {Object.keys(stats.byBreed).length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Age Distribution */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                          Age Distribution
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(stats.byAge).map(([age, count]) => (
                            <div
                              key={age}
                              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium text-gray-700">
                                {age}
                              </span>
                              <div className="flex items-center space-x-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${(count / stats.total) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-blue-600 min-w-[60px]">
                                  {count} ({getPercentage(count)}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sex Distribution */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                          Sex Distribution
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(stats.bySex).map(([sex, count]) => (
                            <div
                              key={sex}
                              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium text-gray-700">
                                {sex}
                              </span>
                              <div className="flex items-center space-x-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{
                                      width: `${(count / stats.total) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-green-600 min-w-[60px]">
                                  {count} ({getPercentage(count)}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Breeds */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                          Top 10 Breeds
                        </h3>
                        <div className="space-y-3">
                          {topBreeds.map(([breed, count], index) => (
                            <div
                              key={breed}
                              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-500 w-6">
                                  #{index + 1}
                                </span>
                                <span className="font-medium text-gray-700">
                                  {breed}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-600 h-2 rounded-full"
                                    style={{
                                      width: `${(count / stats.total) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-purple-600 min-w-[60px]">
                                  {count} ({getPercentage(count)}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outcome Distribution */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                          Outcome Distribution
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(stats.byOutcome).map(
                            ([outcome, count]) => (
                              <div
                                key={outcome}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                              >
                                <span className="font-medium text-gray-700">
                                  {outcome}
                                </span>
                                <div className="flex items-center space-x-4">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-orange-600 h-2 rounded-full"
                                      style={{
                                        width: `${
                                          (count / stats.total) * 100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-semibold text-orange-600 min-w-[60px]">
                                    {count} ({getPercentage(count)}%)
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentView === "map" && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <GoogleMapComponent
                      dogs={filteredDogs.filter(
                        (dog) => dog.location_lat && dog.location_long
                      )}
                      onMarkerClick={handleMarkerClick}
                      selectedDog={selectedDog}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Dog Detail Modal */}
        {selectedDog && (
          <DogDetailModal
            dog={selectedDog}
            isOpen={!!selectedDog}
            onClose={closeModal}
            onEdit={handleEditDog}
            onDelete={handleDeleteDog}
          />
        )}
      </main>
    </div>
  );
};

export default MainPage;
