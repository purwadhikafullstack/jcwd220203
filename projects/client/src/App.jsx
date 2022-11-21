import axios from "axios"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login"
import { useDispatch } from "react-redux"
import { axiosInstance } from "./api"
import { login } from "./redux/features/authSlice"
import GuestRoute from "./component/GuestRoute"
import Register from "./pages/Register"
import RegisterVerification from "./pages/RegisterVerification"
import AdminDashboard from "./components/admin/AdminDashboard"
import "./AdminDashboard.css"
import SideNavBar from "./components/SideNavBar"
import { Box } from "@chakra-ui/react"
import WarehouseManagement from "./components/admin/WarehouseManagement"
import ChangePassword from "./pages/profile/ChangePassword"
import Profile from "./pages/profile/Profile"

function App() {
    const [message, setMessage] = useState("")

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
            <SideNavBar />
            <Box marginLeft="275px" marginTop={"50px"}>
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
                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                    <Route
                        path="/warehouse-management"
                        element={<WarehouseManagement />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                        path="/profile/change-password"
                        element={<ChangePassword />}
                    />
                </Routes>
            </Box>
        </>
    )
}

export default App
