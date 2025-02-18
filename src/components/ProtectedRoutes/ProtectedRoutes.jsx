import React from "react";
import { Navigate } from "react-router-dom";
export default function ProtectedRoutes(props) {
  const tkn = localStorage.getItem("userToken");
  if (tkn) {
    return props.children;
  } else {
    return <Navigate to={"/login"} />;
  }
}
