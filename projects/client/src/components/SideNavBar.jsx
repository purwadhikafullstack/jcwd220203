import { Button, Text, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import "../AdminDashboard.css";
import Logo from "../assets/Shopedia.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";

const SideNavBar = () => {
  const authSelector = useSelector((state) => state.auth);

  const navigate = useNavigate()

  const dispatch = useDispatch();
  const toast = useToast();

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token");
    dispatch(logout());
    toast({
      title: "User Logout",
      status: "info",
    });
    navigate("/");
  };

  return (
    <div className="wrapper">
      {/* Leftside */}
      <div className="sidebar">
        {/* ID data from authselector */}
        <div className="profile">
          <img src={Logo} alt="profile_picture" />
          <h3>Hello, {authSelector.username}!</h3>
          <p>Admin : {authSelector.RoleId}</p>
        </div >

        {/* Dashboard */}
        < ul >
          <li>
            <Link to="/admin/dashboard">
              <Text>Dashboard Homepage</Text>
            </Link>
          </li>
          <li>
            <Link to="/admin/warehouse-management">
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
            <a href="/admin/product">
              <Text>Manage Product Data</Text>
            </a>
          </li>
          <li>
            <Link to="/admin/category">
              <Text>Manage Category</Text>
            </Link>
          </li>
          <li>
            <a href="#empty">
              <Text>Update Product Stock</Text>
            </a>
          </li>
          <li>
            <a href="/user-data">
              <Text>Change Role Status</Text>
            </a>
          </li>
          <li>
            <a href="/user-data">
              <Text>Change Role Status</Text>
            </a>
          </li>
          <li>
            <a href="#empty">
              <Text>Sales Report</Text>
            </a>
          </li>
          <li>
            <Button
              ml={"75px"}
              size={"sm"}
              mt={"10px"}
              onClick={logoutBtnHandler}
            >
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNavBar;
