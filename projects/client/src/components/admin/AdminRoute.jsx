import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AdminRoute = ({ children }) => {
    const authSelector = useSelector((state) => state.auth)

    const navigate = useNavigate()

    if (!authSelector.id) {
        navigate("/")
    }
    return children
}

export default AdminRoute
