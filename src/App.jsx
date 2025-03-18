import "./App.css";
import "./index.css";
import Layout from "./components/Layout/Layout";
import Workout from "./components/Workout/Workout";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import UserContextProvider from "./Context/UserContext";
import Exercise from "./components/Exercise/Exercise";
import WorkoutContextProvider from "./Context/WorkoutContext";
import { Toaster } from "react-hot-toast";
let router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        path: "",
        element: <Login />,
      },
      {
        path: "workout",
        element: (
          <ProtectedRoutes>
            <Workout />
          </ProtectedRoutes>
        ),
      },
      {
        path: "exercise/:workoutId",
        element: (
          <ProtectedRoutes>
            <Exercise />
          </ProtectedRoutes>
        ),
      },
      {
        path: "ForgotPasswordPage",
        element: <ForgotPasswordPage />,
      },
      {
        path: "ResetPasswordPage",
        element: <ResetPasswordPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <WorkoutContextProvider>
      <UserContextProvider>
        <RouterProvider router={router}></RouterProvider>
        <Toaster />
      </UserContextProvider>
    </WorkoutContextProvider>
  );
}

export default App;
