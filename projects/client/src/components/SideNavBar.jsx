import { Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import "../AdminDashboard.css"
import Logo from "../assets/Shopedia.png"

const SideNavBar = () => {
  return (
    <div className="wrapper">
      {/* Leftside */}
      <div className="sidebar">
        {/* ID data from authselector */}
        <div className="profile">
          <img src={Logo} alt="profile_picture" />
          <h3>Bejus</h3>
          <p>Admin</p>
        </div>

        {/* Dashboard */}
        <ul>
          <li>
            <Link to="/admin-dashboard">
              <Text>Dashboard Homepage</Text>
            </Link>
          </li>
          <li>
            <Link to="/warehouse-management">
              <Text>Warehouse Management</Text>
            </Link>
          </li>
          <li>
            <Link to={"/manage-admin-data"}>
              <Text>Manage Admin Data</Text>
            </Link>
          </li>
          <li>
            <Link to="/manage-user-data">
              <Text>Manage User Data</Text>
            </Link>
          </li>
          <li>
            <Link>
              <Text>Manage Product Data</Text>
            </Link>
          </li>
          <li>
            <Link>
              <Text>Manage Category</Text>
            </Link>
          </li>
          <li>
            <a href="#empty">
              <Text>Update Product Stock</Text>
            </a>
          </li>
          <li>
            <a href="#empty">
              <Text>All Users Order / Confirm Payment</Text>
            </a>
          </li>
          <li>
            <a href="#empty">
              <Text>Sales Report</Text>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SideNavBar
