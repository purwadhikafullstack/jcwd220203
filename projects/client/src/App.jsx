import axios from "axios"
import { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import LoginPage from "./pages/Login"
import { useDispatch, useSelector } from "react-redux"
import { axiosInstance } from "./api"
import { login } from "./redux/features/authSlice"
import GuestRoute from "./components/GuestRoute"
import Register from "./pages/Register"
import RegisterVerification from "./pages/RegisterVerification"
import AdminDashboard from "./pages/admin/AdminDashboard"
import "./AdminDashboard.css"
import SideNavBar from "./components/SideNavBar"
import { Box } from "@chakra-ui/react"
import WarehouseManagement from "./pages/admin/WarehouseManagement"
import ChangePassword from "./pages/profile/ChangePassword"
import Profile from "./pages/profile/Profile"
import ManageUserData from "./pages/admin/ManageUserData"
import ManageAdminData from "./pages/admin/ManageAdminData"

function App() {
  const location = useLocation()
  const [message, setMessage] = useState("")
  const authSelector = useSelector((state) => state.auth)

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      )
      setMessage(data?.message || "")
    })()
  }, [])

  const [authCheck, setAuthCheck] = useState(false)

  const dispatch = useDispatch()

  const keepUserLoggedIn = async () => {
    try {
      const auth_token = localStorage.getItem("auth_token")

      if (!auth_token) {
        setAuthCheck(true)
        return
      }

      const response = await axiosInstance.get("/auth/refresh-token")

      dispatch(login(response.data.data))

      localStorage.setItem("auth_token", response.data.token)
      setAuthCheck(true)
    } catch (err) {
      console.log(err)
      setAuthCheck(true)
    } finally {
      setAuthCheck(true)
    }
  }

  useEffect(() => {
    keepUserLoggedIn()
  }, [])

  return (
    <>
      {location.pathname === "/admin-dashboard" ||
      location.pathname === "/manage-user-data" ||
      location.pathname === "/manage-admin-data" ||
      location.pathname === "/warehouse-management" ? (
        <SideNavBar />
      ) : null}

      {authSelector.role === "admin" ? <SideNavBar /> : null}
      <Box>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/register/verification"
            element={<RegisterVerification />}
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/warehouse-management"
            element={<WarehouseManagement />}
          />
          <Route path="/manage-user-data" element={<ManageUserData />} />
          <Route path="/manage-admin-data" element={<ManageAdminData />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
        </Routes>
      </Box>
    </>
  )
}

export default App
