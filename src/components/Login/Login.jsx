import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaSpinner } from "react-icons/fa";
import { UserContext } from "../../Context/UserContext";
export default function Login() {
  let navigate = useNavigate();
  let { setUserLogin } = useContext(UserContext);
  const [apiError, setApiError] = useState(null);
  const [isLoad, setIsLoad] = useState(false);

  async function handleLogin(formValues) {
    setIsLoad(true);
    setApiError(null);
    try {
      let { data } = await axios.post(
        "https://fitness-workout-tracker-chi.vercel.app/user/login",
        formValues
      );

      if (data?.success && data?.token) {
        localStorage.setItem("userToken", data.token);
        setUserLogin(data.token);
        navigate("/workout");
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoad(false);
    }
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

  const ErrorMessage = ({ error, touched }) => {
    if (!error || !touched) return null;
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
        {error}
      </div>
    );
  };

  return (
    <div>
      {apiError && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-30"
          role="alert"
        >
          {apiError}
        </div>
      )}
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
            <input
              type="text"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              name="email"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@example.com"
            />
          </div>
          <ErrorMessage
            error={formik.errors?.email}
            touched={formik.touched?.email}
          />

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 mt-5 text-sm font-medium text-black"
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
          <ErrorMessage
            error={formik.errors?.password}
            touched={formik.touched?.password}
          />

          <div className="flex items-center">
            <button
              type="submit"
              disabled={isLoad}
              className={`text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                isLoad ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoad ? <FaSpinner className="animate-spin" /> : "Login"}
            </button>
            <p className="pl-4">
              Don't have an account?
              <span className="font-semibold">
                <Link to="/register" className="p-2">
                  Signup
                </Link>
              </span>
            </p>
          </div>

          <p className="mt-7">
            Forget Password?{" "}
            <Link to="/ForgotPasswordPage" className="font-semibold p-2">
              Reset Password
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
