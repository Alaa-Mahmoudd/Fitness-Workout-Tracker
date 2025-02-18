import React from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import * as yup from "yup";
import { FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import { UserContext } from "../../Context/UserContext";
export default function Login() {
  let { setUserLogin } = useContext(UserContext);
  let navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  async function handleLogin(formValues) {
    setIsLoad(true);
    axios
      .post(
        "https://fitness-workout-tracker-virid.vercel.app/user/login",
        formValues
      )
      .then((apiResponse) => {
        if (apiResponse?.data?.success) {
          const token = apiResponse?.data?.token;
          if (token) {
            localStorage.setItem("userToken", token);
            setUserLogin(token);
            setIsLoad(false);
            navigate("/workout");
          }
        } else {
          setApiError("Unexpected response from server");
        }
      })
      .catch((error) => {
        setApiError(
          error?.apiResponse?.data?.message || "An unexpected error occurred"
        );
      });
  }

  let validationSchema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters and include at least 1 letter and 1 number"
      )
      .required("Password is required"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });
  return (
    <div>
      {apiError ? (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-30"
          role="alert"
        >
          {apiError}
        </div>
      ) : null}
      <div className="m-10 p-10">
        <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto">
          <div className="flex justify-center items-center">
            <h1 className="text-black mt-10 mb-7 font-bold text-xl">Login</h1>
          </div>

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

          <div className="flex items-center">
            <button
              type="submit"
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              {isLoad ? <FaSpinner /> : "Login"}
            </button>
            <p className="pl-4">
              Don't have an account?
              <span className="font-semibold">
                <Link to={"/register"} className="p-2">
                  Signup
                </Link>
              </span>
            </p>
          </div>
          <div className="flex items-center mt-7">
            <div>
              <p>Forget Password?</p>
            </div>
            <span className="font-semibold">
              <Link to={"/ForgotPasswordPage"} className="p-2">
                Reset Password
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
