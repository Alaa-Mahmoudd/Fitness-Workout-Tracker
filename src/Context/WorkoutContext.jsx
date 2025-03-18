import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export let WorkoutContext = createContext();
function WorkoutContextProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    date: "",
    isCompleted: false,
  });

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userToken");
    }
    return null;
  };

  // Fetch all Workouts
  const getWorkouts = useCallback(async (status = "upcoming") => {
    const token = getToken();
    if (!token) {
      setApiError("Authentication token is missing. Please log in.");
      return;
    }
    setApiError(null);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://fitness-workout-tracker-chi.vercel.app/workout?status=${status}`,
        { headers: { token } }
      );
      if (response?.data?.success) {
        setWorkouts(response.data.result);
        setApiError(null);
      } else {
        setApiError("Unexpected response from server.");
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setApiError(null);
      setIsLoading(false);
    }
  }, []);

  // Add Workout
  async function addWorkout(newWorkout) {
    if (!newWorkout.name || !newWorkout.date) {
      toast.error("Workout name and date are required.");
      return;
    }
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://fitness-workout-tracker-chi.vercel.app/workout/",
        newWorkout,
        { headers: { token } }
      );
      if (response.data.success) {
        setWorkouts((prevWorkouts) => [...prevWorkouts, response.data.result]);
        setShowForm(false);
        getWorkouts();
        toast.success("Workout added successfully!");
        setApiError(null);
      } else {
        toast.error("Failed to add workout.");
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setApiError(null);
      setIsLoading(false);
    }
  }

  // Delete Workout
  async function deleteWorkout(id) {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      await axios.delete(
        `https://fitness-workout-tracker-chi.vercel.app/workout/${id}`,
        { headers: { token } }
      );
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout._id !== id)
      );
      toast.success("Workout deleted successfully!");
    } catch (error) {
      setApiError(error?.response?.data?.message || "Error deleting workout.");
      toast.error(error?.response?.data?.message || "Error deleting workout.");
    } finally {
      setIsLoading(false);
      setApiError(null);
    }
  }

  // Update Workout Status
  async function updateWorkout(id, newStatus) {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      await axios.put(
        `https://fitness-workout-tracker-chi.vercel.app/workout/${id}`,
        { isCompleted: newStatus },
        { headers: { token } }
      );
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout._id === id ? { ...workout, isCompleted: newStatus } : workout
        )
      );
      toast.success("Workout status updated successfully!");
      setApiError(null);
    } catch (error) {
      setApiError(error?.response?.data?.message || "Error updating workout.");
      toast.error(error?.response?.data?.message || "Error updating workout.");
    } finally {
      setIsLoading(false);
      setApiError(null);
    }
  }

  useEffect(() => {
    setApiError(null);
    getWorkouts();
  }, [getWorkouts]);

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
        addWorkout,
        deleteWorkout,
        updateWorkout,
        newWorkout,
        setNewWorkout,
        showForm,
        setShowForm,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export default WorkoutContextProvider;
