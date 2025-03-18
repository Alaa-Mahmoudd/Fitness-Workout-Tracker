import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaSpinner } from "react-icons/fa";

export default function Register() {
  let navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoad, setIsLoad] = useState(false);

  async function handleRegister(formValues) {
    setIsLoad(true);
    setApiError(null); // إعادة تعيين الأخطاء السابقة

    try {
      let { data } = await axios.post(
        "https://fitness-workout-tracker-chi.vercel.app/user/register",
        formValues
      );

      if (data?.success) {
        // ✅ توجيه المستخدم إلى صفحة تسجيل الدخول بعد نجاح التسجيل
        navigate("/");
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
      .required("Confirmed password is required"),
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
      {apiError && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          {apiError}
        </div>
      )}
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
          <input
            type="text"
            id="userName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.userName}
            name="userName"
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Your Name"
          />
          {formik.errors.userName && formik.touched.userName && (
            <div className="p-2 text-sm text-red-800 bg-red-50 rounded-lg">
              {formik.errors.userName}
            </div>
          )}
          <label
            htmlFor="email"
            className="block mb-2 mt-5 text-sm font-medium text-black"
          >
            Your Email
          </label>
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
          {formik.errors.email && formik.touched.email && (
            <div className="p-2 text-sm text-red-800 bg-red-50 rounded-lg">
              {formik.errors.email}
            </div>
          )}
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
          {formik.errors.password && formik.touched.password && (
            <div className="p-2 text-sm text-red-800 bg-red-50 rounded-lg">
              {formik.errors.password}
            </div>
          )}
          <label
            htmlFor="confirmPassword"
            className="block mb-2 mt-5 text-sm font-medium text-black"
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
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="p-2 text-sm text-red-800 bg-red-50 rounded-lg">
              {formik.errors.confirmPassword}
            </div>
          )}
          <div className="flex items-center mt-5">
            <button
              type="submit"
              disabled={isLoad}
              className={`text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                isLoad ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoad ? <FaSpinner className="animate-spin" /> : "Signup"}
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
