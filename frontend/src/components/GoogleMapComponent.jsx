import React, { useState, useEffect } from "react";

const GoogleMapComponent = ({ dogs, onMarkerClick, selectedDog }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Debug logging
  console.log("GoogleMapComponent received dogs:", dogs);
  console.log("Dogs length:", dogs?.length || 0);
  console.log("Sample dog data:", dogs?.[0]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  // Group dogs by location to avoid overlapping markers
  const groupedDogs =
    dogs?.reduce((acc, dog) => {
      const key = `${dog.location_lat},${dog.location_long}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(dog);
      return acc;
    }, {}) || {};

  console.log("Grouped dogs:", groupedDogs);
  console.log("Grouped dogs entries:", Object.entries(groupedDogs));

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  // Try to load Google Maps with a fallback
  const tryLoadGoogleMaps = () => {
    setShowMap(true);
  };

  return (
    <div style={mapContainerStyle}>
      {!showMap ? (
        // Fallback view when Google Maps is not available
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
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
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Rescue Locations Map
            </h3>
            <p className="text-gray-500 mb-4">
              Dog rescue locations with detailed information
            </p>

            {/* Show rescue locations as an interactive list */}
            <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">
                  Rescue Locations ({dogs?.length || 0} dogs)
                </h4>
                {userLocation && (
                  <div className="text-sm text-blue-600">
                    📍 Your location: {userLocation.lat.toFixed(4)},{" "}
                    {userLocation.lng.toFixed(4)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedDogs).length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <div className="text-gray-500 mb-2">
                      No rescue locations found
                    </div>
                    <div className="text-sm text-gray-400">
                      {dogs?.length === 0
                        ? "No dogs with location data available"
                        : "No dogs match the current filters"}
                    </div>
                  </div>
                ) : (
                  Object.entries(groupedDogs).map(
                    ([location, dogsAtLocation], index) => {
                      const [lat, lng] = location.split(",").map(Number);
                      const firstDog = dogsAtLocation[0];

                      // Calculate distance from user if available
                      let distance = null;
                      if (userLocation) {
                        const R = 6371; // Earth's radius in km
                        const dLat = ((lat - userLocation.lat) * Math.PI) / 180;
                        const dLng = ((lng - userLocation.lng) * Math.PI) / 180;
                        const a =
                          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos((userLocation.lat * Math.PI) / 180) *
                            Math.cos((lat * Math.PI) / 180) *
                            Math.sin(dLng / 2) *
                            Math.sin(dLng / 2);
                        const c =
                          2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        distance = R * c;
                      }

                      return (
                        <div
                          key={location}
                          className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer bg-white"
                          onClick={() => onMarkerClick(firstDog)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {dogsAtLocation.length}
                                </span>
                              </div>
                              <span className="font-medium text-sm">
                                Location #{index + 1}
                              </span>
                            </div>
                            {distance && (
                              <span className="text-xs text-gray-500">
                                {distance.toFixed(1)} km away
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-600 mb-2">
                            📍 {lat.toFixed(4)}, {lng.toFixed(4)}
                          </div>

                          <div className="space-y-1">
                            {dogsAtLocation.slice(0, 3).map((dog, dogIndex) => (
                              <div
                                key={dog.animal_id || dogIndex}
                                className="text-xs"
                              >
                                •{" "}
                                {dog.name && dog.name.trim()
                                  ? dog.name
                                  : "Unnamed"}{" "}
                                ({dog.breed})
                              </div>
                            ))}
                            {dogsAtLocation.length > 3 && (
                              <div className="text-xs text-gray-500">
                                ... and {dogsAtLocation.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={tryLoadGoogleMaps}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Try Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Google Maps view (will show error if API key is invalid)
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Google Maps Error
            </h3>
            <p className="text-gray-500 mb-4">API key configuration required</p>
            <button
              onClick={() => setShowMap(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Back to List View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
