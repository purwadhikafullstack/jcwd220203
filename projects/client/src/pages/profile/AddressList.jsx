import { Box, Button, Text, HStack } from "@chakra-ui/react"
import { BiUser } from "react-icons/bi"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Address from "../../components/profile/Address"

const AddressList = () => {
  const authSelector = useSelector((state) => state.auth)

  return (
    <Box mt="55px" fontSize={"16px"} color="rgba(0,0,0,.54)">
      <Box w="1208px" marginX={"auto"}>
        <Box display={"flex"} mt="80px" mb="16px">
          <Box mr="8px" my={"auto"}>
            <BiUser fontSize={"20px"} />
          </Box>
          <Text fontSize={"16px"} fontWeight="bold" my={"auto"}>
            {authSelector.username}
          </Text>
        </Box>
        <Box border={"1px solid #dfe1e3"} borderRadius="10px">
          <HStack>
            {/* Personal Info */}
            <Box display={"flex"} height="53px" fontWeight={"bold"}>
              <Link to="/user/profile">
                <Box p="16px 24px" _hover={{ color: "#0095DA" }}>
                  <Text>Personal Info</Text>
                </Box>
              </Link>
            </Box>

            {/* Change Password */}
            <Box display={"flex"} height="53px" fontWeight={"bold"}>
              <Link to="/user/profile/change-password">
                <Box p="16px 24px" _hover={{ color: "#0095DA" }}>
                  <Text>Change Password</Text>
                </Box>
              </Link>
            </Box>

            {/* Address List */}
            <Box display={"flex"} height="53px" fontWeight={"bold"}>
              <Button
                p="16px 24px"
                color="#0095DA"
                borderBottom={"2px solid #0095DA"}
                borderRadius="1px"
                variant="link"
              >
                <Text>Address List</Text>
              </Button>
            </Box>
          </HStack>
          <Box borderTop={"1px solid #dfe1e3"} p="30px 16px 16px">
            <Box textAlign={"right"}>
              <Button
                m="0 4px"
                _hover={false}
                color="white"
                bgColor={"#F7931E"}
              >
                Add A New Address
              </Button>
            </Box>
            <Box
              border={"1px solid #dfe1e3"}
              borderRadius="10px"
              m="16px 4px 4px"
              p="16px 24px"
              fontWeight={"bold"}
              color="black"
              fontSize={"14px"}
            >
              <Text>Label</Text>
              <Text>Nama</Text>
              <Text mt="4px" fontWeight={"normal"}>
                phone number
              </Text>
              <Text fontWeight={"normal"}>full address</Text>
              <Link>
                <Text mt="16px" fontSize={"12px"} color={"#F7931E"}>
                  Ubah Alamat
                </Text>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddressList
