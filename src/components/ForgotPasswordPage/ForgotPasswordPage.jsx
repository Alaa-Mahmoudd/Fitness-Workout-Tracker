import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";

export default function ForgotPasswordPage() {
  let navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  async function ResetPassword(formValues) {
    setIsLoad(true);
    axios
      .patch(
        "https://fitness-workout-tracker-chi.vercel.app/user/forget_code",
        formValues
      )
      .then((apiResponse) => {
        if (apiResponse?.data?.success) {
          setApiSuccess(
            apiResponse?.data?.message || "Code sent successfully!"
          );
          navigate("/ResetPasswordPage");
        } else {
          setApiError("Unexpected response from server");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        setApiError(
          error?.response?.data?.message || "An unexpected error occurred"
        );
      })
      .finally(() => {
        setIsLoad(false);
      });
  }

  let validationSchema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: ResetPassword,
  });

  return (
    <div>
      {apiSuccess && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 mt-30"
          role="alert"
        >
          <p>{apiSuccess}</p>
        </div>
      )}

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
            <h1 className="text-black mt-10 mb-7 font-bold text-xl">
              Send Code via Email
            </h1>
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
          {formik.errors.email && formik.touched.email && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {formik.errors.email}
            </div>
          )}

          <div className="flex items-center mt-7 justify-center ">
            <button
              type="submit"
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              {isLoad ? <FaSpinner /> : "Send Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
