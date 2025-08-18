import React, { useMemo, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

function GoogleMapComponent({ dogs = [], onMarkerClick, selectedDog }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Filter and process dog data
  const validDogs = useMemo(() => {
    return (dogs || []).filter(
      (d) =>
        Number.isFinite(d?.location_lat) && Number.isFinite(d?.location_long)
    );
  }, [dogs]);

  // Group dogs by location (rounded coordinates for clustering)
  const locationGroups = useMemo(() => {
    const groups = {};
    validDogs.forEach((dog) => {
      const lat = Math.round(dog.location_lat * 100) / 100;
      const lng = Math.round(dog.location_long * 100) / 100;
      const key = `${lat},${lng}`;

      if (!groups[key]) {
        groups[key] = {
          lat,
          lng,
          dogs: [],
          count: 0,
        };
      }
      groups[key].dogs.push(dog);
      groups[key].count++;
    });
    return Object.values(groups);
  }, [validDogs]);

  // Calculate map center based on data
  const mapCenter = useMemo(() => {
    const avgLat =
      locationGroups.reduce((sum, loc) => sum + loc.lat, 0) /
      locationGroups.length;
    const avgLng =
      locationGroups.reduce((sum, loc) => sum + loc.lng, 0) /
      locationGroups.length;

    return { lat: avgLat, lng: avgLng };
  }, [locationGroups]);

  const handleMarkerClick = (location) => {
    setSelectedLocation(
      selectedLocation?.lat === location.lat &&
        selectedLocation?.lng === location.lng
        ? null
        : location
    );
  };

  const handleDogClick = (dog) => {
    if (onMarkerClick) {
      onMarkerClick(dog);
    }
  };

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
      (import.meta &&
        import.meta.env &&
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
      "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8", // Fallback key
  });

  if (loadError) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-sm text-gray-600">
        Failed to load Google Maps. Please check your API key configuration.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading map…</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {validDogs.length} dogs found in {locationGroups.length} locations
        </div>
      </div>

      {/* Google Maps */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Dog Locations ({validDogs.length} dogs)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Click markers to view details
          </p>
        </div>

        <div className="relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={locationGroups.length > 0 ? 10 : 6}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {locationGroups.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => handleMarkerClick(location)}
                label={{
                  text: location.count.toString(),
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                icon={{
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#ef4444" stroke="white" stroke-width="3"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                }}
              />
            ))}
          </GoogleMap>

          {/* Location list overlay */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">
              Location List
            </h4>
            <div className="space-y-2">
              {locationGroups.map((location, index) => (
                <div
                  key={index}
                  onClick={() => handleMarkerClick(location)}
                  className={`p-2 rounded cursor-pointer transition-all text-xs ${
                    selectedLocation?.lat === location.lat &&
                    selectedLocation?.lng === location.lng
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-500">
                      {location.count}
                    </span>
                    <span className="text-gray-600">
                      {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected location details */}
      {selectedLocation && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              Location: {selectedLocation.lat.toFixed(3)},{" "}
              {selectedLocation.lng.toFixed(3)} ({selectedLocation.count} dogs)
            </h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedLocation.dogs.map((dog, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all ${
                  selectedDog?.animal_id === dog.animal_id
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="font-medium text-gray-800">
                  {dog.name || "Unnamed"}
                </div>
                <div className="text-sm text-gray-600">
                  {dog.breed || "Unknown Breed"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ID: {dog.animal_id}
                </div>
                <button
                  onClick={() => handleDogClick(dog)}
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data message */}
      {validDogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No location data available</div>
          <div className="text-sm">
            Dog data does not contain location information (latitude/longitude)
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleMapComponent;
