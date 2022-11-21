import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const authSelector = useSelector((state) => state.auth)

    const location = useLocation()

    if (!authSelector.id) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
}

export default ProtectedRoute

