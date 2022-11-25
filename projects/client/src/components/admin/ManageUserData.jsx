import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { axiosInstance } from "../../api"

const ManageUserData = () => {
  const [userData, setUserData] = useState([])

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/userData/getAllUser")

      // console.log(response.data.data[2].Role.role_name)
      setUserData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderUser = () => {
    return userData.map((val) => {
      return (
        <Tr>
          <Td>{val.id.toString()}</Td>
          <Td>{val.profile_picture || "null"}</Td>
          <Td>{val.username || "null"}</Td>
          <Td>{val.email}</Td>
          <Td>{val.phone_number || "null"}</Td>
          <Td>{val.Role.role_name || "null"}</Td>
          <Td>{val.Addresses.map((val) => val.address) || "null"}</Td>
        </Tr>
      )
    })
  }

  useEffect(() => {
    fetchUserData()
  }, [])
  return (
    <Box marginLeft={"230px"}>
      <Box p="20px 0">
        <Text fontSize={"2xl"} fontWeight="bold" color={"#F7931E"}>
          User Data
        </Text>
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th w="10px">ID</Th>
            <Th>Photo Profile</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Role</Th>
            <Th>Address</Th>
          </Tr>
        </Thead>
        <Tbody>{renderUser()}</Tbody>
      </Table>
    </Box>
  )
}
export default ManageUserData
