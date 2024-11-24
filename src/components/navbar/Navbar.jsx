import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useAppStore } from "../../store";
import usericon from "./usericon.png";
import axios from "axios";
import toast from "react-hot-toast";
import { apiClient } from "../../lib/api-client";
import { LOGOUT_ROUTE } from "../../utils/constants";

function Navbar() {
  const [activeLink, setActiveLink] = useState("");
  const { userInfo, setUserInfo } = useAppStore();

  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isdropdownOpen, setIsdropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handledropdown = (e) => {
    e.stopPropagation();
    setIsdropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsdropdownOpen(false);
      }
    };

    if (isdropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isdropdownOpen]);

  const handleLogout = async () => {
    try {
      const data = await apiClient.get(LOGOUT_ROUTE, { withCredentials: true });

      if (data.data.success) {
        localStorage.setItem("isAuth", false);
        setUserInfo(undefined);
        toast.success("User Logged Out successfully");

        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <nav className="navbar-main">
      <div className="logo">
        ROOM<span>NEST</span>
      </div>
      <ul className="nav-links">
        {/* {["Home", "Property", "About", "List Property"].map((link) => (
          <li key={link}>
            <Link
              to={`${link == "Home" ? "/" : link.toLowerCase()}`}
              className={activeLink === link ? "active" : ""}
              onClick={() => handleClick(link)}
            >
              {link}
            </Link>
          </li>
        ))} */}

        <li>
          <Link
            to={"/"}
            className={activeLink === "home" ? "active" : ""}
            onClick={() => handleClick("home")}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/property"}
            className={activeLink === "property" ? "active" : ""}
            onClick={() => handleClick("property")}
          >
            Property
          </Link>
        </li>
        <li>
          <Link
            to={"/mylistings"}
            className={activeLink === "mylistings" ? "active" : ""}
            onClick={() => handleClick("mylistings")}
          >
            My Listings
          </Link>
        </li>
        <li>
          <Link
            to={"/listproperty"}
            className={activeLink === "listproperty" ? "active" : ""}
            onClick={() => handleClick("listproperty")}
          >
            List Property
          </Link>
        </li>
      </ul>
      {userInfo ? (
        <div className="user-profile-icon" onClick={handledropdown}>
          <div className="icon">
            <img src={usericon} alt="" />
          </div>
          <div className="user-profile-name">
            <p>{userInfo.first_name}</p>
          </div>
          {isdropdownOpen && (
            <div className="user-dropdown-options" ref={dropdownRef}>
              <Link to="/profile">Profile</Link>
              <Link to="/savedProperties">Saved Properties</Link>
              <Link to="/listproperty">Create Listing</Link>
              <div onClick={handleLogout}>Logout </div>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-links">
          <Link to={"/signin"} className="signin">
            Sign in
          </Link>
          <Link to={"/login"}>
            <button className="login-btn">Login</button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
