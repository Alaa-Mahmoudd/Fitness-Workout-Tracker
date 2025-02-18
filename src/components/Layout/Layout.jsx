import { Outlet } from "react-router-dom";
import NavBar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
export default function Layout() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
