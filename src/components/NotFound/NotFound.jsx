import React from "react";
import { FaRegSadTear } from "react-icons/fa";
export default function NotFound() {
  return (
    <div className="flex justify-center items-center mt-40 ">
      <div className="text-center text-black p-8 rounded-lg shadow-xl bg-opacity-75">
        <FaRegSadTear className="text-6xl mb-6" />
        <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
        <p className="text-xl mb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
