import { Box, Text, useToast } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../api"
const AddressCard = ({
  address_labels,
  recipients_name,
  full_address,
  phone_number,
  id,
  on_delete,
  on_edit,
}) => {
  return (
    <Box
      boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
      borderRadius="10px"
      m="16px 4px 4px"
      p="16px 24px"
      fontWeight={"bold"}
      color="black"
      fontSize={"14px"}
    >
      <Text>{address_labels}</Text>
      <Text>{recipients_name}r</Text>
      <Text mt="4px" fontWeight={"normal"}>
        {phone_number}
      </Text>
      <Text fontWeight={"normal"}>{full_address}</Text>
      <Box display={"flex"}>
        <Link>
          <Text
            mt="16px"
            fontSize={"12px"}
            color={"#F7931E"}
            borderRight={"1px solid #dfe1e3"}
            pr="12px"
            mr="12px"
            onClick={on_edit}
          >
            Change Address
          </Text>
        </Link>
        <Link>
          <Text
            mt="16px"
            fontSize={"12px"}
            color={"#F7931E"}
            borderRight={"1px solid #dfe1e3"}
            pr="12px"
            mr="12px"
          >
            Make Address Primary & Select
          </Text>
        </Link>
        <Link>
          <Text
            mt="16px"
            fontSize={"12px"}
            color={"#F7931E"}
            onClick={on_delete}
          >
            Delete
          </Text>
        </Link>
      </Box>
    </Box>
  )
}

export default AddressCard
