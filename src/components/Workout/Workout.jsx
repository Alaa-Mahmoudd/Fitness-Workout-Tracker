import React, { useState, useEffect, useContext } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { WorkoutContext } from "../../Context/WorkoutContext";
export default function Workout() {
  const {
    getWorkouts,
    apiError,
    isLoading,
    addWorkout,
    deleteWorkout,
    updateWorkout,
    newWorkout,
    setNewWorkout,
    showForm,
    setShowForm,
    workouts,
    setWorkouts,
  } = useContext(WorkoutContext);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  function handleSave() {
    if (newWorkout.name && newWorkout.date) {
      addWorkout(newWorkout);
      setNewWorkout({ name: "", date: "", isCompleted: false });
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <div>
        <h1 className="text-center font-bold mt-7 mb-3 text-xl">My Workouts</h1>
        <p className="text-lg font-semibold text-gray-600">{today}</p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <FaSpinner className="animate-spin text-6xl text-red-500 mt-5 mb-5" />
        </div>
      ) : apiError ? (
        <div className="text-red-500 font-bold text-2xl flex justify-center items-center mt-7">
          <h1>{apiError}</h1>
        </div>
      ) : Array.isArray(workouts) && workouts?.length > 0 ? (
        <div className="mt-10 w-full max-w-lg">
          <ul className="space-y-4">
            {workouts?.map((workout) => (
              <li
                key={workout?._id}
                className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <span className="text-lg font-semibold">{workout?.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 ml-2">
                    {workout?.isCompleted ? "✅ Completed" : "🕒 Upcoming"}
                  </span>
                </div>
                <div className="mt-2">
                  <Link
                    to={`/exercise/${workout?._id}`}
                    className="text-black-500 hover:text-red-500"
                  >
                    Exercise
                  </Link>
                </div>
                <div className="flex space-x-3">
                  <span
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={() =>
                      updateWorkout(workout?._id, !workout?.isCompleted)
                    }
                  >
                    <FaEdit />
                  </span>
                  <span
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteWorkout(workout?._id)}
                  >
                    <FaTrash />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-red-500 flex justify-center items-center text-center font-bold text-2xl mt-10">
          <h1>No workouts found</h1>
        </div>
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
        <h1 className="text-xl mt-4 font-semibold">Add Workout</h1>
      </div>

      {showForm && (
        <div className="mt-4 w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Workout Name"
            value={newWorkout?.name}
            onChange={(e) =>
              setNewWorkout({ ...newWorkout, name: e.target.value })
            }
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={newWorkout?.date}
            onChange={(e) =>
              setNewWorkout({ ...newWorkout, date: e.target.value })
            }
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          />

          <div className="mt-4">
            <input
              type="checkbox"
              id="upcoming"
              name="status"
              checked={newWorkout?.isCompleted === false}
              onChange={() =>
                setNewWorkout({ ...newWorkout, isCompleted: false })
              }
            />
            <label htmlFor="upcoming" className="ml-2">
              Upcoming
            </label>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleSave}
              className="bg-red-500 text-white p-3 rounded-md"
            >
              {isLoading ? <FaSpinner className="animate-spin " /> : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
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
