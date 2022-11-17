import axios from "axios"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import RegisterPassword from "./pages/RegisterPassword"

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
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/register/verification" element={<RegisterPassword />} />
      </Routes>
    </div>
  )
}

export default App
