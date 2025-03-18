import React, { useState, useEffect, useContext } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { WorkoutContext } from "../../Context/WorkoutContext";
export default function Exercise() {
  const {
    getWorkouts,
    workouts,
    setWorkouts,
    apiError,
    isLoading,
    setIsLoading,
    setApiError,
    showForm,
    setShowForm,
  } = useContext(WorkoutContext);
  const { workoutId } = useParams();
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    comments: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  // Fetch All Workouts
  useEffect(() => {
    setApiError(null);
    getWorkouts();
  }, [getWorkouts]);
  // Add Exercise
  async function addExercise(workoutId, newExercise) {
    if (!workoutId) {
      setApiError("Workout ID is missing!");
      return;
    }
    const token = localStorage.getItem("userToken");
    if (!token) {
      setApiError("Please Login!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://fitness-workout-tracker-chi.vercel.app/exercise/${workoutId}`,
        newExercise,
        { headers: { token } }
      );
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout._id === workoutId
            ? {
                ...workout,
                exercises: [
                  ...workout.exercises,
                  {
                    _id: response.data._id,
                    name: response.data.name || newExercise.name,
                    sets: response.data.sets || newExercise.sets,
                    reps: response.data.reps || newExercise.reps,
                    comments: response.data.comments || newExercise.comments,
                  },
                ],
              }
            : workout
        )
      );
      setIsLoading(false);
      setShowForm(false);
      setNewExercise({ name: "", sets: "", reps: "", comments: "" });
    } catch (error) {
      setApiError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
  //Update Exercise
  async function updateExercise(workoutId, exerciseId, updatedExercise) {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setApiError("Please Login!");
      return;
    }
    try {
      const response = await axios.put(
        `https://fitness-workout-tracker-chi.vercel.app/exercise/${workoutId}/${exerciseId}`,
        updatedExercise,
        { headers: { token } }
      );

      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout._id === workoutId
            ? {
                ...workout,
                exercises: workout.exercises.map((ex) =>
                  ex._id === exerciseId
                    ? {
                        ...ex,
                        name: response.data.name,
                        sets: response.data.sets,
                        reps: response.data.reps,
                        comments: response.data.comments,
                      }
                    : ex
                ),
              }
            : workout
        )
      );

      setShowForm(false);
      setEditMode(false);
      setNewExercise({ name: "", sets: "", reps: "", comments: "" });
    } catch (error) {
      setApiError(`An unexpected error occurred: ${error.message}`);
    }
  }

  // Delete Exercise
  async function deleteExercise(workoutId, exerciseId) {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setApiError("Please Login!");
      return;
    }

    try {
      await axios.delete(
        `https://fitness-workout-tracker-chi.vercel.app/exercise/${workoutId}/${exerciseId}`,
        { headers: { token } }
      );

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
    } catch (error) {
      setApiError(`An unexpected error occurred: ${error.message}`);
    }
  }
  // Handle Save Button Click
  function handleSave() {
    if (editMode) {
      updateExercise(workoutId, currentExerciseId, {
        sets: newExercise.sets,
        reps: newExercise.reps,
      });
    } else {
      addExercise(workoutId, newExercise);
    }
  }

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
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentWorkout = workouts.find((workout) => workout._id === workoutId);
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-center font-bold mt-7 mb-3 text-xl">My Exercises</h1>
      <p className="text-lg font-semibold text-gray-600">{today}</p>
      {isLoading ? (
        <FaSpinner className="animate-spin text-6xl text-red-500 mt-5 mb-5" />
      ) : apiError ? (
        <div className="text-red-500 font-bold text-2xl">{apiError}</div>
      ) : currentWorkout && currentWorkout.exercises.length > 0 ? (
        <div className="mt-10 w-full max-w-lg">
          <ul className="space-y-4">
            {currentWorkout.exercises.map((ex) => (
              <div key={ex._id} className="p-4 bg-white rounded-lg shadow-md">
                <div>{ex?.name}</div>
                <div>{ex?.sets} sets</div>
                <div>{ex?.reps} reps</div>
                <div>{ex?.comments}</div>
                <div className="flex space-x-3">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setEditMode(true);
                      setShowForm(true);
                      setCurrentExerciseId(ex._id);
                      setNewExercise({
                        name: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        comments: ex.comments,
                      });
                    }}
                  >
                    <FaEdit />
                  </span>
                  <span
                    className="cursor-pointer text-red-500"
                    onClick={() => deleteExercise(workoutId, ex._id)}
                  >
                    <FaTrash />
                  </span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-red-500 flex justify-center items-center text-center font-bold text-2xl mt-10">
          No Exercises found
        </div>
      )}
      <div className="text-center mt-6">
        <div className="flex justify-center">
          <span
            className="text-2xl text-red-500 cursor-pointer"
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              setNewExercise({ name: "", sets: "", reps: "", comments: "" });
            }}
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
