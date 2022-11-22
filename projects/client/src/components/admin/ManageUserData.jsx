import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
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
      return (
        <Tr>
          <Td>{val.id}</Td>
          <Td>{val.profile_picture || "null"}</Td>
          <Td>{val.username || "null"}</Td>
          <Td>{val.email}</Td>
          <Td>{val.phone_number || "null"}</Td>
          <Td>{val.role || "null"}</Td>
        </Tr>
      )
    })
  }

  useEffect(() => {
    fetchUserData()
  }, [])
  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Photo Profile</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Role</Th>
          </Tr>
        </Thead>
        <Tbody>{renderUser()}</Tbody>
      </Table>
    </>
  )
}
export default ManageUserData
