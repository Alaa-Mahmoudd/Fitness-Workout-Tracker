import React, { useState, useEffect, useContext } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { WorkoutContext } from "../../Context/WorkoutContext";

export default function Exercise() {
  const {
    getWorkouts,
    workouts,
    apiError,
    isLoading,
    setWorkouts,
    setIsLoading,
    setApiError,
  } = useContext(WorkoutContext);
  const { workoutId } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    comments: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState(null);

  // Fetch All Ex-workouts
  useEffect(() => {
    getWorkouts();
  }, [getWorkouts]);

  // Add Exercise
  async function addExercise(workoutId) {
    if (!workoutId) {
      setApiError("Workout ID is missing!");
      return;
    }
    const token = localStorage.getItem("userToken");
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://fitness-workout-tracker-virid.vercel.app/exercise/${workoutId}`,
        newExercise,
        { headers: { token } }
      );
      if (response?.data?.success) {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout._id === workoutId
              ? { ...workout, exercises: [...workout.exercises, response.data] }
              : workout
          )
        );
        setShowForm(false);
      } else {
        setApiError("Failed to add exercise.");
      }
    } catch (error) {
      setApiError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Update Exercise
  async function updateExercise(workoutId, exerciseId) {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://fitness-workout-tracker-virid.vercel.app/exercise/${workoutId}/${exerciseId}`,
        newExercise,
        { headers: { token } }
      );
      if (response?.data?.success) {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout._id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map((ex) =>
                    ex._id === exerciseId ? { ...ex, ...newExercise } : ex
                  ),
                }
              : workout
          )
        );
        setShowForm(false);
        setEditMode(false);
      } else {
        setApiError("Failed to update exercise.");
      }
    } catch (error) {
      setApiError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Delete Exercise
  async function deleteExercise(workoutId, exerciseId) {
    console.log(workoutId, exerciseId);
    const token = localStorage.getItem("userToken");
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `https://fitness-workout-tracker-virid.vercel.app/exercise/${workoutId}/${exerciseId}`,
        { headers: { token } }
      );
      if (response?.data?.success) {
        setWorkouts((prevWorkouts) =>
          prevWorkouts.map((workout) =>
            workout._id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.filter(
                    (ex) => ex._id !== exerciseId
                  ),
                }
              : workout
          )
        );
      } else {
        setApiError("Failed to delete exercise.");
      }
    } catch (error) {
      setApiError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Save Button Click
  function handleSave() {
    if (editMode) {
      updateExercise(workoutId, currentExerciseId);
    } else {
      addExercise(workoutId);
    }
  }

  // Handle Edit Button Click
  function handleEdit(exerciseId) {
    const selectedExercise = workouts
      .find((workout) => workout._id === workoutId)
      ?.exercises.find((ex) => ex._id === exerciseId);
    setNewExercise({
      name: selectedExercise.name,
      sets: selectedExercise.sets,
      reps: selectedExercise.reps,
      comments: selectedExercise.comments,
    });
    setEditMode(true);
    setCurrentExerciseId(exerciseId);
    setShowForm(true);
  }

  // Handle Cancel Button Click
  function handleCancel() {
    setShowForm(false);
    setEditMode(false);
    setNewExercise({
      name: "",
      sets: "",
      reps: "",
      comments: "",
    });
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-center font-bold mt-7 mb-3 text-xl">My Exercises</h1>
      {isLoading ? (
        <FaSpinner className="animate-spin text-6xl text-red-500 mt-5 mb-5" />
      ) : apiError ? (
        <div className="text-red-500 font-bold text-2xl">{apiError}</div>
      ) : workouts?.length ? (
        <div className="mt-10 w-full max-w-lg">
          <ul className="space-y-4">
            {workouts
              .find((workout) => workout._id === workoutId)
              ?.exercises.map((ex) => (
                <div key={ex._id} className="p-4 bg-white rounded-lg shadow-md">
                  <div>{ex.name}</div>
                  <div>{ex.sets} sets</div>
                  <div>{ex.reps} reps</div>
                  <div>{ex.comments}</div>
                  <div className="flex space-x-3">
                    <span onClick={() => handleEdit(ex._id)}>
                      <FaEdit />
                    </span>
                    <span onClick={() => deleteExercise(workoutId, ex._id)}>
                      <FaTrash />
                    </span>
                  </div>
                </div>
              ))}
          </ul>
        </div>
      ) : (
        <div className="text-red-500 text-center">No Exercises found</div>
      )}

      <div className="text-center mt-6">
        <div className="flex justify-center">
          <span
            className="text-2xl text-red-500 cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            <FaPlusCircle />
          </span>
        </div>
        <h1 className="text-xl mt-4 font-semibold">Add Exercise </h1>
      </div>
      {showForm && (
        <div className="mt-4 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Exercise Name"
            value={newExercise.name}
            onChange={(e) =>
              setNewExercise({ ...newExercise, name: e.target.value })
            }
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Sets"
            value={newExercise.sets}
            onChange={(e) =>
              setNewExercise({ ...newExercise, sets: e.target.value })
            }
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Reps"
            value={newExercise.reps}
            onChange={(e) =>
              setNewExercise({ ...newExercise, reps: e.target.value })
            }
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Comments"
            value={newExercise.comments}
            onChange={(e) =>
              setNewExercise({ ...newExercise, comments: e.target.value })
            }
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleSave}
              className="bg-red-500 text-white p-3 rounded-md"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white p-3 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
