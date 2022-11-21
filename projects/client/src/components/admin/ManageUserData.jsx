import { Box } from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { axiosInstance } from "../../api"

const ManageUserData = () => {
  const [userData, setUserData] = useState([])

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/userData/getAllUser")

      console.log(response.data.data)
      setUserData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderUser = () => {
    return userData.map((val) => {
      return <Box>{val.username}</Box>
    })
  }

  useEffect(() => {
    fetchUserData()
  }, [])
  return (
    <>
      Halo
      {renderUser()}
    </>
  )
}
export default ManageUserData
