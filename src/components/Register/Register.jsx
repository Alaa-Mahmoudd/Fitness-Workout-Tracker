import React from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "./../../../node_modules/axios/lib/axios";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import * as yup from "yup";
import { FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import { UserContext } from "../../Context/UserContext";
export default function Register() {
  let navigate = useNavigate();
  let { setUserLogin } = useContext(UserContext);
  const [apiError, setApiError] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  async function handleRegister(formValues) {
    setIsLoad(true);
    axios
      .post(
        "https://fitness-workout-tracker-virid.vercel.app/user/register",
        formValues
      )
      .then((apiResponse) => {
        if (apiResponse?.data?.success) {
          if (apiResponse?.data?.token) {
            localStorage.setItem("userToken", apiResponse.data.token);
            setUserLogin(apiResponse.data.token);
            navigate("/");
          }
          setIsLoad(false);
        } else {
          setApiError("Unexpected response from server");
        }
      })
      .catch((error) => {
        setApiError(
          error?.response?.data?.message || "An unexpected error occurred"
        );
      });
  }
  let validationSchema = yup.object().shape({
    userName: yup
      .string()
      .min(3, "Name minlength is 3")
      .max(10, "Name maxlength is 10")
      .required("Name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters and include at least 1 letter and 1 number"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        "password and confirmed password must be same"
      )
      .required("confirmed password is required"),
  });
  let formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });
  return (
    <div className="mt-0 m-0">
      {apiError ? (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-30 "
          role="alert"
        >
          {apiError}
        </div>
      ) : null}
      <div className="m-10 p-10">
        <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto">
          <div className="flex justify-center items-center">
            <h1 className="text-black mt-10 mb-7 font-bold text-xl">
              Registration
            </h1>
          </div>
          <label
            htmlFor="userName"
            className="block mb-2 text-sm font-medium text-black"
          >
            Username
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-black bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
              <svg
                className="w-4 h-4 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </span>
            <input
              type="text"
              id="userName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              name="userName"
              className="rounded-none rounded-e-lg bg-white border border-gray-300 text-black focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
              placeholder="Your Name"
            />
          </div>
          {formik.errors.userName && formik.touched.userName ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {formik.errors.userName}
            </div>
          ) : null}
          <label
            htmlFor="email"
            className="block mb-2 mt-5 text-sm font-medium text-black"
          >
            Your Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              type="text"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              name="email"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="name@example.com"
            />
          </div>
          {formik.errors.email && formik.touched.email ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {formik.errors.email}
            </div>
          ) : null}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 mt-5  text-sm font-medium text-black"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              name="password"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          {formik.errors.password && formik.touched.password ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {formik.errors.password}
            </div>
          ) : null}
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block mb-2  mt-5 text-sm font-medium text-black"
            >
              Repeat password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {formik.errors.confirmPassword}
            </div>
          ) : null}
          <div className="flex items-center">
            <button
              type="submit"
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              {isLoad ? <FaSpinner /> : "Signup"}
            </button>
            <p className="pl-4">
              Already have an account?
              <span className="font-semibold">
                <Link to={"/"} className="p-2">
                  Login Now
                </Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
