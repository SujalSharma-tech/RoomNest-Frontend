/* eslint-disable react/prop-types */
import { useState } from "react";
import "./profilepage.scss";
import { useAppStore } from "../../store";
import axios from "axios";
import {
  UPDATE_PASSWORD_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../utils/constants";
import { apiClient } from "../../lib/api-client";
import toast from "react-hot-toast";

const PasswordModal = ({ isOpen, onClose }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    // Here you would typically make an API call to update the password
    try {
      const data = await apiClient.post(
        UPDATE_PASSWORD_ROUTE,
        {
          currpassword: passwordData.oldPassword,
          newpassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );
      if (data.data.success) {
        toast.success(data.data.message);
      } else {
        toast.error(data.data.message);
      }
    } catch (err) {
      console.error(err);
    }

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [activeTab, setActiveTab] = useState("account");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userInfo?.first_name || "Default",
    lastName: userInfo?.last_name || "user",
    phoneNumber: userInfo?.phone_number || "",
    email: userInfo?.email || "example@gmail.com",
    city: userInfo?.city || "",
    country: userInfo?.country || "",
    usertype: userInfo?.user_type || "Student",
  });

  //   const stats = {
  //     applied: 32,
  //     won: 26,
  //     current: 6,
  //   };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleformsubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          city: formData.city,
          country: formData.country,
          user_type: formData.usertype,
        },
        { withCredentials: true }
      );
      if (data.data.success) {
        setUserInfo(data.data.user);
        toast.success(data.data.message);
      } else {
        toast.error(data.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return userInfo ? (
    <div className="profile-page">
      <div className="profile-container">
        {/* Mobile Menu Button */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className="hamburger-icon"></span>
          Menu
        </button>

        <aside
          className={`profile-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}
        >
          <div className="mobile-close-button" onClick={toggleMobileMenu}>
            ×
          </div>
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src="/usericon.png"
                alt="Profile"
                className="profile-image"
              />
              {/* <div className="verified-badge"></div> */}
            </div>
            <h2 className="profile-name">
              {userInfo?.first_name + " " + userInfo?.last_name}
            </h2>
            <p className="profile-title">{userInfo?.user_type || "Student"}</p>
          </div>

          {/* <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Opportunities applied</span>
              <span className="stat-value applied">{stats.applied}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Opportunities won</span>
              <span className="stat-value won">{stats.won}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current opportunities</span>
              <span className="stat-value current">{stats.current}</span>
            </div>
          </div> */}

          <button className="view-profile-btn">View Public Profile</button>
          <div className="profile-url">
            <span className="url-text">https://domain.com/user</span>
            <button className="copy-btn">
              <i className="copy-icon">📋</i>
            </button>
          </div>
        </aside>

        <main className="settings-content">
          <nav className="settings-nav">
            <div className="nav-scroll">
              <button
                className={`nav-btn ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                Account Settings
              </button>
              {/* <button
                className={`nav-btn ${activeTab === "company" ? "active" : ""}`}
                onClick={() => setActiveTab("company")}
              >
                Company Settings
              </button>
              <button
                className={`nav-btn ${
                  activeTab === "notifications" ? "active" : ""
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                Notifications
              </button> */}
            </div>
          </nav>

          <form className="settings-form" onSubmit={handleformsubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  style={{ cursor: "not-allowed" }}
                  value={formData.email}
                  disabled
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  placeholder="Enter City"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  name="country"
                  placeholder="Enter Country"
                  value={formData.country || ""}
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="change-password-btn"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </button>
              <button type="submit" className="update-btn">
                Update Profile
              </button>
            </div>
          </form>
        </main>
      </div>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  ) : (
    "Error Fetching User"
  );
};

export default ProfilePage;
