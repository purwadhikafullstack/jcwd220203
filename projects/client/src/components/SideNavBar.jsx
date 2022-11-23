import { Text } from "@chakra-ui/react";
import "../AdminDashboard.css"
import Logo from "../assets/Shopedia.png"
import { useSelector } from "react-redux"

const SideNavBar = () => {
  const authSelector = useSelector((state) => state.auth)

  return (
    <div className="wrapper">
      {/* Leftside */}
      <div className="sidebar">
        {/* ID data from authselector */}
        <div className="profile">
          <img
            src= { Logo }
            alt="profile_picture"
          />
          <h3>Welcome, {authSelector.username}!</h3>
          <p>Admin Dashboard</p>
        </div>


        {/* Dashboard */}
        <ul>
          <li>
            <a href="/admin-dashboard">
                <Text>Dashboard Homepage</Text>
            </a>
          </li>
          <li>
            <a href="/warehouse-management">
                <Text>Warehouse Management</Text>
            </a>
          </li>
          <li>
            <a href="/user-data">
                <Text>Change Role Status</Text>
            </a>
          </li>
          <li>
            <a href="#empty">
                <Text>Manage User Data & Category</Text>
            </a>
          </li>
          <li>
            <a href="#empty">
                <Text>Manage Product Data</Text>
            </a>
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
  );
};

export default SideNavBar;
