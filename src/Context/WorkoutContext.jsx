import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export let WorkoutContext = createContext();

function WorkoutContextProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getWorkouts(status = "upcoming") {
    const token = localStorage.getItem("userToken");
    if (!token) {
      const token = localStorage.getItem("userToken");
      setApiError("Authentication token is missing. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `https://fitness-workout-tracker-virid.vercel.app/workout?status=${status}`,
        { headers: { token } }
      );
      if (response?.data?.success) {
        setWorkouts(response.data.result);
      } else {
        setApiError("Unexpected response from server.");
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getWorkouts();
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        getWorkouts,
        workouts,
        apiError,
        isLoading,
        setWorkouts,
        setIsLoading,
        setApiError,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export default WorkoutContextProvider;
