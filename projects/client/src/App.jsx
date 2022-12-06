import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "./api";
import { login } from "./redux/features/authSlice";
import GuestRoute from "./components/GuestRoute";
import Register from "./pages/Register";
import RegisterVerification from "./pages/RegisterVerification";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./AdminDashboard.css";
import SideNavBar from "./components/SideNavBar";
import WarehouseManagement from "./pages/admin/AdminWarehouseManagement";
import ChangePassword from "./pages/profile/ChangePassword";
import Profile from "./pages/profile/Profile";
import AdminRoute from "./components/admin/AdminRoute";
import AddressList from "./pages/profile/AddressList";
import { attach } from "./redux/features/resetSlice";
import ResetPasswordConfirmation from "./pages/ResetPasswordConfirmation";
import RequestResetPassword from "./pages/RequestResetPassword";
import ManageUserData from "./components/admin/ManageUserData";
import ManageAdminData from "./components/admin/ManageAdminData";
import AdminCategory from "./pages/AdminCategory";
import NotFound from "./components/404Page";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductData from "./pages/admin/ProductData";
import ProductDataDetail from "./pages/admin/ProductDataDetail";

function App() {
  const [message, setMessage] = useState("");
  const authSelector = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);

  const [authCheck, setAuthCheck] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  const keepUserLoggedIn = async () => {
    try {
      const auth_token = localStorage.getItem("auth_token");

      if (!auth_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get("/auth/refresh-token");

      dispatch(login(response.data.data));

      localStorage.setItem("auth_token", response.data.token);
      setAuthCheck(true);
    } catch (err) {
      console.log(err);
      setAuthCheck(true);
    } finally {
      setAuthCheck(true);
    }
  };

  const userResetData = async () => {
    try {
      const reset_token = localStorage.getItem("reset_token");

      if (!reset_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get("/auth/refresh-token");

      dispatch(attach(response.data.data));

      localStorage.setItem("reset_token", response.data.token);
      setAuthCheck(true);
    } catch (err) {
      console.log(err);
      setAuthCheck(true);
    } finally {
      setAuthCheck(true);
    }
  };

  useEffect(() => {
    keepUserLoggedIn();
    userResetData();
  }, []);

    return (
        <>
            {authSelector.RoleId === 3 || authSelector.RoleId === 2 ? (
                <SideNavBar />
            ) : null}

            {location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "/reset-password-confirmation" ||
            location.pathname === "/request-reset-password" ||
            authSelector.RoleId === 3 ||
            authSelector.RoleId === 2 ? null : (
                <Box>
                    <Navbar />
                </Box>
            )}

            <Routes>
                <Route path="/*" element={<NotFound />} />
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/reset-password-confirmation"
                    element={<ResetPasswordConfirmation />}
                />

                <Route
                    path="/manage-admin-data"
                    element={
                        <AdminRoute>
                            <ManageAdminData />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/manage-user-data"
                    element={
                        <AdminRoute>
                            <ManageUserData />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/request-reset-password"
                    element={
                        <GuestRoute>
                            <RequestResetPassword />
                        </GuestRoute>
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/register/verification"
                    element={<RegisterVerification />}
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

                <Route
                    path="/admin/category"
                    element={
                        <AdminRoute>
                            <AdminCategory />
                        </AdminRoute>
                    }
                />

        <Route
          path="/admin/warehouse-management"
          element={
            <AdminRoute>
              <WarehouseManagement />
            </AdminRoute>
          }
        />

        {/* Profiling Route */}
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/address"
          element={
            <ProtectedRoute>
              <AddressList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product"
          element={
            <AdminRoute>
              <ProductData />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/detail/:id"
          element={
            <AdminRoute>
              <ProductDataDetail />
            </AdminRoute>
          }
        />
      </Routes>

      {location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/reset-password-confirmation" ||
      location.pathname === "/request-reset-password" ||
      authSelector.RoleId === 3 ||
      authSelector.RoleId === 2 ? null : (
        <Box>
          <Footer />
        </Box>
      )}
    </>
  );
}

export default App;
