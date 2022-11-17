import axios from "axios"
import "./App.css"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login"
import { useDispatch } from "react-redux"
import { axiosInstance } from "./api"
import { login } from "./redux/features/authSlice"
import GuestRoute from "./component/GuestRoute"

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    (async () => {
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
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
