import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Auth.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import axios from "axios";
import toast from "react-hot-toast";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../utils/constants";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo } = useAppStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasCase: false,
    passwordsMatch: false,
  });

  const validatePassword = (password) => {
    setValidations({
      minLength: password.length >= 8,
      hasNumber:
        /(?=.*[0-9])/.test(password) || /(?=.*[!@#$%^&*])/.test(password),
      hasCase: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      passwordsMatch: password === formData.confirmPassword,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "confirmPassword") {
      setValidations((prev) => ({
        ...prev,
        passwordsMatch: formData.password === value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Object.values(validations).every(Boolean);

    if (isValid) {
      console.log("Form submitted:", formData);
      try {
        const data = await apiClient.post(
          SIGNUP_ROUTE,
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );
        if (data.data.success) {
          console.log(data);
          toast.success("User Signup success");
          setUserInfo(data.data.user);
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Form has validation errors");
    }
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <button className="back-btn" onClick={handleBackClick}>
            ←
          </button>
          <span className="member-text">
            Already member? <Link to={"/login"}>Sign in</Link>
          </span>
        </div>

        <div className="auth-form">
          <h1>Sign Up</h1>
          <p>Register now and be a part of Roomnest</p>

          <form onSubmit={handleSubmit}>
            <div
              className="input-group"
              style={{ display: "flex", gap: "15px" }}
            >
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="password-requirements">
              <p className={validations.minLength ? "valid" : ""}>
                Least 8 characters
              </p>
              <p className={validations.hasNumber ? "valid" : ""}>
                Least one number (0-9) or a symbol
              </p>
              <p className={validations.hasCase ? "valid" : ""}>
                Lowercase (a-z) and uppercase (A-Z)
              </p>
              {formData.confirmPassword && (
                <p className={validations.passwordsMatch ? "valid" : ""}>
                  Passwords match
                </p>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-Type Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={!Object.values(validations).every(Boolean)}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  console.log(from);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUserInfo } = useAppStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBackClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiClient.post(LOGIN_ROUTE, formData, {
        withCredentials: true,
      });
      if (data.data.success) {
        setUserInfo(data.data.user);
        toast.success("User login success");
        localStorage.setItem("isAuth", true);
        console.log(data.data.user);
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.log(err);
      localStorage.setItem("isAuth", false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <button className="back-btn" onClick={handleBackClick}>
            ←
          </button>
          <span className="member-text">
            New user? <Link to={"/signin"}>Sign up</Link>
          </span>
        </div>

        <div className="auth-form">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-gray-500 mb-8">Welcome back to Roomnest.</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="sign-in-btn"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="forgot-password-div forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button className="auth-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { SignUp, Login };
