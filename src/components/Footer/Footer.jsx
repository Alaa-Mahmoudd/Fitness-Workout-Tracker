import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagramSquare,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-white text-red-500  py-4 mt-8 w-full bottom-0 mt-20">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 myFitness. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link
            to="/workout"
            className="text-red-500 text-lg hover:text-red-700"
          >
            Workout
          </Link>
          <Link
            to="/register"
            className="text-red-500 text-lg hover:text-red-700"
          >
            Register
          </Link>

          <Link to="/" className="text-red-500 text-lg hover:text-red-700">
            Login
          </Link>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500  text-2xl hover:text-blue-600"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500  text-2xl hover:text-blue-400"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500  text-2xl hover:text-pink-600"
          >
            <FaInstagramSquare />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 text-2xl hover:text-black"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 text-2xl hover:text-red-600"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}
