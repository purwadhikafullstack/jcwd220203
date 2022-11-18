import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import "./AdminDashboard.css";
import SideNavBar from "./components/SideNavBar";
import { Box } from "@chakra-ui/react";
import WarehouseManagement from "./components/admin/WarehouseManagement";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);
  return (
    <div>
      <SideNavBar />
      <Box 
      marginLeft="275px"
      marginTop={"50px"}
      >
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/warehouse-management" element={<WarehouseManagement />} />
      </Routes>
      </Box>
    </div>
  );
}

export default App;
