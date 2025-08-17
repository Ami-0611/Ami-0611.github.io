const API_BASE_URL = "http://localhost:8000/api";

// Cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (extended from 5 minutes)
const LONG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for static data

// Helper function to check if cache is valid
const isCacheValid = (timestamp, duration = CACHE_DURATION) => {
  return Date.now() - timestamp < duration;
};

// Helper function to get cached data
const getCachedData = (key, duration = CACHE_DURATION) => {
  const cached = apiCache.get(key);
  if (cached && isCacheValid(cached.timestamp, duration)) {
    console.log(`Using cached data for: ${key}`);
    return cached.data;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
  });
  console.log(`Cached data for: ${key}`);
};

// Offline fallback data (basic structure)
const offlineFallback = {
  dogs: [],
  breeds: [],
  "rescue-types": [],
};

// API service functions
export const apiService = {
  // Get all dogs with caching and offline fallback
  async getDogs() {
    const cacheKey = "dogs";
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      console.log("Fetching dogs from API...");
      const response = await fetch(`${API_BASE_URL}/dogs/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching dogs:", error);
      console.log("Using offline fallback data");
      return offlineFallback.dogs;
    }
  },

  // Get all breeds with long-term caching (24 hours)
  async getBreeds() {
    const cacheKey = "breeds";
    const cachedData = getCachedData(cacheKey, LONG_CACHE_DURATION);

    if (cachedData) {
      return cachedData;
    }

    try {
      console.log("Fetching breeds from API...");
      const response = await fetch(`${API_BASE_URL}/breeds/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching breeds:", error);
      console.log("Using offline fallback data");
      return offlineFallback.breeds;
    }
  },

  // Get all rescue types with long-term caching (24 hours)
  async getRescueTypes() {
    const cacheKey = "rescue-types";
    const cachedData = getCachedData(cacheKey, LONG_CACHE_DURATION);

    if (cachedData) {
      return cachedData;
    }

    try {
      console.log("Fetching rescue types from API...");
      const response = await fetch(`${API_BASE_URL}/rescue-types/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching rescue types:", error);
      console.log("Using offline fallback data");
      return offlineFallback["rescue-types"];
    }
  },

  // Add a new dog
  async addDog(dogData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding dog:", error);
      throw error;
    }
  },

  // Update a dog
  async updateDog(dogData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating dog:", error);
      throw error;
    }
  },

  // Delete a dog
  async deleteDog(dogId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: dogId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting dog:", error);
      throw error;
    }
  },

  // Filter dogs by rescue type
  async getDogsByRescueType(rescueType) {
    try {
      const allDogs = await this.getDogs();
      return allDogs.filter((dog) => dog.rescue_type === rescueType);
    } catch (error) {
      console.error("Error filtering dogs by rescue type:", error);
      throw error;
    }
  },

  // Filter dogs by breed
  async getDogsByBreed(breed) {
    try {
      const allDogs = await this.getDogs();
      return allDogs.filter((dog) => dog.breed === breed);
    } catch (error) {
      console.error("Error filtering dogs by breed:", error);
      throw error;
    }
  },

  // Add a new breed
  async addBreed(breedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/breeds/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(breedData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      // Clear breeds cache to refresh the list
      this.clearCacheItem("breeds");
      return result;
    } catch (error) {
      console.error("Error adding breed:", error);
      throw error;
    }
  },

  // Update a breed
  async updateBreed(id, breedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/breeds/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(breedData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      // Clear breeds cache to refresh the list
      this.clearCacheItem("breeds");
      return result;
    } catch (error) {
      console.error("Error updating breed:", error);
      throw error;
    }
  },

  // Delete a breed
  async deleteBreed(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/breeds/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      // Clear breeds cache to refresh the list
      this.clearCacheItem("breeds");
      return { success: true };
    } catch (error) {
      console.error("Error deleting breed:", error);
      throw error;
    }
  },

  // Add a new rescue type
  async addRescueType(rescueTypeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/rescue-types/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rescueTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      // Clear rescue-types cache to refresh the list
      this.clearCacheItem("rescue-types");
      return result;
    } catch (error) {
      console.error("Error adding rescue type:", error);
      throw error;
    }
  },

  // Update a rescue type
  async updateRescueType(id, rescueTypeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/rescue-types/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rescueTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      // Clear rescue-types cache to refresh the list
      this.clearCacheItem("rescue-types");
      return result;
    } catch (error) {
      console.error("Error updating rescue type:", error);
      throw error;
    }
  },

  // Delete a rescue type
  async deleteRescueType(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/rescue-types/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      // Clear rescue-types cache to refresh the list
      this.clearCacheItem("rescue-types");
      return { success: true };
    } catch (error) {
      console.error("Error deleting rescue type:", error);
      throw error;
    }
  },

  // Update dog
  async updateDog(id, dogData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      // Clear dogs cache to refresh the list
      this.clearCacheItem("dogs");
      return await response.json();
    } catch (error) {
      console.error("Error updating dog:", error);
      throw error;
    }
  },

  // Delete dog
  async deleteDog(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      // Clear dogs cache to refresh the list
      this.clearCacheItem("dogs");
      return { success: true };
    } catch (error) {
      console.error("Error deleting dog:", error);
      throw error;
    }
  },

  // Add dog
  async addDog(dogData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      // Clear dogs cache to refresh the list
      this.clearCacheItem("dogs");
      return await response.json();
    } catch (error) {
      console.error("Error adding dog:", error);
      throw error;
    }
  },

  // Clear all cached data
  clearCache() {
    apiCache.clear();
    console.log("API cache cleared");
  },

  // Clear specific cached data
  clearCacheItem(key) {
    apiCache.delete(key);
    console.log(`Cleared cache for: ${key}`);
  },

  // Preload all data for faster initial load
  async preloadAllData() {
    console.log("Preloading all data...");
    try {
      // Check cache status first
      const cacheStatus = this.getCacheStatus();
      const hasValidCache = Object.values(cacheStatus).some(
        (item) => item.hasData && item.isValid
      );

      if (hasValidCache) {
        console.log("Cache is valid, preloading will be instant");
      }

      await Promise.all([
        this.getDogs(),
        this.getBreeds(),
        this.getRescueTypes(),
      ]);
      console.log("All data preloaded successfully");
    } catch (error) {
      console.error("Error preloading data:", error);
    }
  },

  // Preload specific data type
  async preloadDataType(dataType) {
    console.log(`Preloading ${dataType} data...`);
    try {
      switch (dataType) {
        case "dogs":
          await this.getDogs();
          break;
        case "breeds":
          await this.getBreeds();
          break;
        case "rescue-types":
          await this.getRescueTypes();
          break;
        default:
          console.warn(`Unknown data type: ${dataType}`);
      }
      console.log(`${dataType} data preloaded successfully`);
    } catch (error) {
      console.error(`Error preloading ${dataType} data:`, error);
    }
  },

  // Check if data is available offline
  isDataAvailableOffline() {
    const status = this.getCacheStatus();
    return Object.values(status).some((item) => item.hasData && item.isValid);
  },

  // Get cache status
  getCacheStatus() {
    const status = {};
    for (const [key, value] of apiCache.entries()) {
      const isLongCache = key === "breeds" || key === "rescue-types";
      const duration = isLongCache ? LONG_CACHE_DURATION : CACHE_DURATION;
      status[key] = {
        hasData: !!value.data,
        isValid: isCacheValid(value.timestamp, duration),
        age: Date.now() - value.timestamp,
        duration: isLongCache ? "24h" : "30min",
        dataCount: Array.isArray(value.data) ? value.data.length : "N/A",
      };
    }
    return status;
  },
};

export default apiService;
