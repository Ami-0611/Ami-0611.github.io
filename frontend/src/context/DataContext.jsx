import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import apiService from "../services/api";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Data states
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [rescueTypes, setRescueTypes] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [dogsLoading, setDogsLoading] = useState(true);
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [rescueTypesLoading, setRescueTypesLoading] = useState(true);

  // Error and cache states
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Global filter state with localStorage persistence
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("dogFilters");
    const initialFilters = savedFilters
      ? JSON.parse(savedFilters)
      : {
          age: "",
          color: "",
          sex: "",
          outcome: "",
          breed: "",
          rescueType: "",
        };
    console.log("Initial filters loaded from localStorage:", initialFilters);
    return initialFilters;
  });

  // Cache data for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Fetch dogs data
  const fetchDogs = async (forceRefresh = false) => {
    if (forceRefresh) {
      apiService.clearCacheItem("dogs");
    }

    try {
      setDogsLoading(true);
      setError(null);

      const dogsData = await apiService.getDogs();
      setDogs(dogsData);
      setLastFetch(Date.now());
      console.log(`Loaded ${dogsData.length} dogs`);
      return dogsData;
    } catch (err) {
      setError("Failed to fetch dogs from API");
      console.error("Error fetching dogs:", err);
      throw err;
    } finally {
      setDogsLoading(false);
    }
  };

  // Fetch breeds data
  const fetchBreeds = async (forceRefresh = false) => {
    if (forceRefresh) {
      apiService.clearCacheItem("breeds");
    }

    try {
      setBreedsLoading(true);
      const breedsData = await apiService.getBreeds();
      setBreeds(breedsData);
      console.log(`Loaded ${breedsData.length} breeds`);
      return breedsData;
    } catch (err) {
      console.error("Error fetching breeds:", err);
      throw err;
    } finally {
      setBreedsLoading(false);
    }
  };

  // Fetch rescue types data
  const fetchRescueTypes = async (forceRefresh = false) => {
    if (forceRefresh) {
      apiService.clearCacheItem("rescue-types");
    }

    try {
      setRescueTypesLoading(true);
      const rescueTypesData = await apiService.getRescueTypes();
      setRescueTypes(rescueTypesData);
      console.log(`Loaded ${rescueTypesData.length} rescue types`);
      return rescueTypesData;
    } catch (err) {
      console.error("Error fetching rescue types:", err);
      throw err;
    } finally {
      setRescueTypesLoading(false);
    }
  };

  // Memoized filtered dogs with enhanced caching
  const filteredDogs = useMemo(() => {
    // If no dogs data, return empty array immediately
    if (!dogs || dogs.length === 0) {
      return [];
    }

    let filtered = [...dogs];

    // Apply filters only if we have data
    if (filters.age) {
      const age = parseInt(filters.age);
      if (filters.age === "young") {
        filtered = filtered.filter((dog) => {
          const dogAge = dog.age_upon_outcome_in_weeks;
          return dogAge >= 0 && dogAge <= 26;
        });
      } else if (filters.age === "adult") {
        filtered = filtered.filter((dog) => {
          const dogAge = dog.age_upon_outcome_in_weeks;
          return dogAge > 26 && dogAge <= 104;
        });
      } else if (filters.age === "senior") {
        filtered = filtered.filter((dog) => {
          const dogAge = dog.age_upon_outcome_in_weeks;
          return dogAge > 104;
        });
      }
    }

    if (filters.color) {
      filtered = filtered.filter((dog) => {
        if (!dog.color) return false;
        return dog.color.toLowerCase().includes(filters.color.toLowerCase());
      });
    }

    if (filters.sex) {
      filtered = filtered.filter((dog) => {
        if (!dog.sex_upon_outcome) return false;
        return dog.sex_upon_outcome.toLowerCase() === filters.sex.toLowerCase();
      });
    }

    if (filters.outcome) {
      filtered = filtered.filter((dog) => {
        if (!dog.outcome_type) return false;
        return dog.outcome_type.toLowerCase() === filters.outcome.toLowerCase();
      });
    }

    if (filters.breed) {
      filtered = filtered.filter((dog) => {
        if (!dog.breed) return false;
        const dogBreed = dog.breed.toLowerCase().trim();
        const filterBreed = filters.breed.toLowerCase().trim();

        // Exact match first, then partial match
        if (dogBreed === filterBreed) return true;
        if (dogBreed.includes(filterBreed)) return true;

        // Handle common variations
        const variations = [
          filterBreed,
          filterBreed.replace(/\s+/g, " "), // normalize spaces
          filterBreed.replace(/[^\w\s]/g, ""), // remove special characters
        ];

        return variations.some(
          (variation) =>
            dogBreed.includes(variation) || variation.includes(dogBreed)
        );
      });
    }

    if (filters.rescueType) {
      filtered = filtered.filter((dog) => {
        if (!dog.rescue_type) return false;
        const dogRescueType = dog.rescue_type.toLowerCase().trim();
        const filterRescueType = filters.rescueType.toLowerCase().trim();

        // Exact match first, then partial match
        if (dogRescueType === filterRescueType) return true;
        if (dogRescueType.includes(filterRescueType)) return true;

        // Handle common variations
        const variations = [
          filterRescueType,
          filterRescueType.replace(/\s+/g, " "), // normalize spaces
          filterRescueType.replace(/[^\w\s]/g, ""), // remove special characters
        ];

        return variations.some(
          (variation) =>
            dogRescueType.includes(variation) ||
            variation.includes(dogRescueType)
        );
      });
    }

    return filtered;
  }, [dogs, filters]);

  // Memoized statistics calculations with enhanced caching
  const stats = useMemo(() => {
    // If no filtered dogs, return empty stats
    if (!filteredDogs || filteredDogs.length === 0) {
      return {
        total: 0,
        byAge: {},
        byColor: {},
        bySex: {},
        byOutcome: {},
        byBreed: {},
        byRescueType: {},
      };
    }

    const stats = {
      total: filteredDogs.length,
      byAge: {},
      byColor: {},
      bySex: {},
      byOutcome: {},
      byBreed: {},
      byRescueType: {},
    };

    filteredDogs.forEach((dog) => {
      // Age groups
      const age = dog.age_upon_outcome_in_weeks;
      let ageGroup = "Unknown";
      if (age) {
        if (age <= 26) ageGroup = "Young (≤6 months)";
        else if (age <= 104) ageGroup = "Adult (6 months - 2 years)";
        else ageGroup = "Senior (2+ years)";
      }
      stats.byAge[ageGroup] = (stats.byAge[ageGroup] || 0) + 1;

      // Colors
      const color = dog.color || "Unknown";
      stats.byColor[color] = (stats.byColor[color] || 0) + 1;

      // Sex
      const sex = dog.sex_upon_outcome || "Unknown";
      stats.bySex[sex] = (stats.bySex[sex] || 0) + 1;

      // Outcomes
      const outcome = dog.outcome_type || "Unknown";
      stats.byOutcome[outcome] = (stats.byOutcome[outcome] || 0) + 1;

      // Breeds
      const breed = dog.breed || "Unknown";
      stats.byBreed[breed] = (stats.byBreed[breed] || 0) + 1;

      // Rescue Types
      const rescueType = dog.rescue_type || "Unknown";
      stats.byRescueType[rescueType] =
        (stats.byRescueType[rescueType] || 0) + 1;
    });

    return stats;
  }, [filteredDogs]);

  // Memoized top breeds
  const topBreeds = useMemo(() => {
    return Object.entries(stats.byBreed)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [stats.byBreed]);

  // Memoized percentage calculator
  const getPercentage = useMemo(() => {
    return (count) => ((count / stats.total) * 100).toFixed(1);
  }, [stats.total]);

  // Update overall loading state
  useEffect(() => {
    setLoading(dogsLoading || breedsLoading || rescueTypesLoading);
  }, [dogsLoading, breedsLoading, rescueTypesLoading]);

  // Initial data fetch with smart caching
  useEffect(() => {
    const loadAllData = async () => {
      try {
        console.log("Starting to load all data...");

        // Check if we have cached data first
        const cacheStatus = apiService.getCacheStatus();
        const hasValidCache = Object.values(cacheStatus).some(
          (item) => item.hasData && item.isValid
        );

        if (hasValidCache) {
          console.log("Using cached data, loading will be faster...");
        }

        // Load all data in parallel for faster loading
        await Promise.all([fetchDogs(), fetchBreeds(), fetchRescueTypes()]);

        setDataInitialized(true);
        console.log("All data loaded successfully");
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    // Only load if not already initialized
    if (!dataInitialized) {
      loadAllData();
    }
  }, [dataInitialized]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dogFilters", JSON.stringify(filters));
    console.log("Filters saved to localStorage:", filters);
  }, [filters]);

  // Custom setFilters function that ensures localStorage is updated
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    localStorage.setItem("dogFilters", JSON.stringify(newFilters));
  };

  const value = {
    dogs,
    breeds,
    rescueTypes,
    filteredDogs,
    loading,
    dogsLoading,
    breedsLoading,
    rescueTypesLoading,
    error,
    stats,
    topBreeds,
    getPercentage,
    fetchDogs,
    fetchBreeds,
    fetchRescueTypes,
    lastFetch,
    filters,
    setFilters: updateFilters,
    setDogs,
    dataInitialized,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
