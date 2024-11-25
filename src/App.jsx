/* eslint-disable react/prop-types */
// import { useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Layout from "./routes/layout/Layout";
// import Navbar from "./components/navbar/Navbar";
import Homepage from "./routes/homepage/Homepage";
import Property from "./routes/property/Property";
import ListProperty from "./routes/listproperty/ListProperty";
import { useEffect } from "react";
import { useAppStore } from "./store";
import axios from "axios";
import { useLoadScript } from "@react-google-maps/api";
import SinglePage from "./routes/singlePage/singlePage";
import MyListings from "./routes/mylistings/MyListings";
import SavedListings from "./routes/savedlistings/SavedListings";
import ProfilePage from "./routes/profilepage/ProfilePage";
import { Login, SignUp } from "./routes/authpages/AuthPages";
import { Toaster } from "react-hot-toast";
import { apiClient } from "./lib/api-client";
import {
  GET_ALL_PROPERTIES_ROUTE,
  GET_SAVED_PROP_ID,
  GET_USER_INFO,
} from "./utils/constants";
import UpdateListing from "./routes/updatelisting/UpdateListing";
const libraries = ["places"];
function App() {
  const {
    setUserInfo,
    setLoading,
    setProperties,
    setIsPropertiesFetched,
    isPropertiesFetched,
    isPropertiesTriggered,
    setPropertiesTriggered,
    userInfo,
    loading,
    properties,
    isLoadingMaps,
    setIsLoadingMaps,
    setSavedProperties,
  } = useAppStore();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_SERVER_GOOGLE_MAP_KEY,
    libraries,
  });
  useEffect(() => {
    if (isLoaded !== isLoadingMaps) {
      setIsLoadingMaps(isLoaded);
    }
  }, [isLoaded, isLoadingMaps, setIsLoadingMaps]);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (data) {
          setUserInfo(data.data.user);
          localStorage.setItem("isAuth", true);
        }
      } catch (err) {
        console.log(err);
        localStorage.setItem("isAuth", false);
      } finally {
        setLoading(false);
      }
    };

    const getAllProperties = async () => {
      try {
        const data = await apiClient.get(GET_ALL_PROPERTIES_ROUTE);
        if (data) {
          setProperties(data.data);
          setIsPropertiesFetched(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }

      try {
        const response = await apiClient.get(GET_SAVED_PROP_ID, {
          withCredentials: true,
        });
        if (response) {
          setSavedProperties(response.data.saved_properties);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (!isPropertiesFetched || isPropertiesTriggered) {
      getAllProperties();
      setPropertiesTriggered(false);
    }

    if (!userInfo) {
      getUserInfo();
    }
  }, [
    setUserInfo,
    userInfo,
    // properties,
    setProperties,
    isPropertiesTriggered,
    setPropertiesTriggered,
    setIsPropertiesFetched,
    setLoading,
  ]);

  const ProtectedRoute = ({ children }) => {
    // const isAuthenticated = localStorage.getItem("isAuth");
    const { userInfo, loading } = useAppStore();
    const isAuthenticated = !!userInfo;
    const location = useLocation();

    if (loading) return <h1>Loading...</h1>;
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  };

  const AuthRoute = ({ children }) => {
    // const isAuthenticated = localStorage.getItem("isAuth");
    const { userInfo, loading } = useAppStore();
    const isAuthenticated = !!userInfo;
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    if (loading) return <h1>Loading...</h1>;
    return isAuthenticated ? <Navigate to={from} replace /> : children;
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Homepage />,
          },
          {
            path: "/property",
            element: <Property />,
          },
          {
            path: "/listproperty",
            element: (
              <ProtectedRoute>
                <ListProperty />
              </ProtectedRoute>
            ),
          },
          {
            path: "/login",
            element: (
              <AuthRoute>
                <Login />
              </AuthRoute>
            ),
          },
          {
            path: "/signin",
            element: (
              <AuthRoute>
                <SignUp />
              </AuthRoute>
            ),
          },
          {
            path: "/propertydetails/:id",
            element: (
              <ProtectedRoute>
                <SinglePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/mylistings",
            element: (
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            ),
          },
          {
            path: "/savedproperties",
            element: (
              <ProtectedRoute>
                <SavedListings />
              </ProtectedRoute>
            ),
          },
          {
            path: "/profile",
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/updatelisting/:id",
            element: <UpdateListing />,
          },
        ],
      },
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
        v7_startTransition: true,
      },
    }
  );

  return (
    <>
      <Toaster />
      <RouterProvider future={{ v7_startTransition: true }} router={router} />
    </>
  );
}

export default App;
