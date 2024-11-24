// import { Outlet } from "react-router-dom";
import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
// import HeroSection from "../../components/herosection/HeroSection";
// import Homepage from "../homepage/Homepage";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
const Layout = () => {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      {/* <div className="content">
        <Homepage />
      </div> */}
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
