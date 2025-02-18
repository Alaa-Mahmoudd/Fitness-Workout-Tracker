import React, { useContext } from "react";
import logo from "../../assets/images/gym.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagramSquare,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { UserContext } from "../../Context/UserContext";
export default function Navbar() {
  const { userLogin, setUserLogin } = useContext(UserContext);
  let navigate = useNavigate();
  function logOut() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/");
  }
  return (
    <nav className=" bg-white-100 top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to={"/"}>
            <img src={logo} width={50} alt="gym-png" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {userLogin !== null ? (
            <div className="flex items-center space-x-6">
              <NavLink
                to={"/workout"}
                className="text-md text-slate-900 font-normal hover:text-green-600"
              >
                Workouts
              </NavLink>
            </div>
          ) : null}
          {userLogin == null ? (
            <>
              <NavLink
                to={""}
                className="text-md text-slate-900 font-normal hover:text-green-600"
              >
                Login
              </NavLink>
              <NavLink
                to={"/register"}
                className="text-md text-slate-900 font-normal hover:text-green-600"
              >
                Register
              </NavLink>
            </>
          ) : (
            <span
              onClick={logOut}
              className="text-md text-slate-900 cursor-pointer font-normal hover:text-green-600"
            >
              Logout
            </span>
          )}
          <div className="flex space-x-2">
            <FaFacebook className="text-xl text-blue-600 hover:text-blue-800" />
            <FaTwitter className="text-xl text-blue-400 hover:text-blue-600" />
            <FaInstagramSquare className="text-xl text-pink-600 hover:text-pink-800" />
            <FaTiktok className="text-xl text-black hover:text-gray-800" />
            <FaYoutube className="text-xl text-red-600 hover:text-red-800" />
          </div>
        </div>
      </div>
    </nav>
  );
}
