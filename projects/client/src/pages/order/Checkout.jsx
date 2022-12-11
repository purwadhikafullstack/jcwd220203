import {
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import ChangeAddress from "../../components/order/ChangeAddress"
import Alert from "../../components/profile/Alert"

const Checkout = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const navigate = useNavigate()
  return (
    <Box w="100%">
      <Box h="60px" borderBottom="1px solid var(--N100,#DBDEE2)">
        <Box my="2" p="0 20px" w={"984px"} mx="auto">
          <Link onClick={onOpen}>
            <Text
              fontSize={"30px"}
              fontWeight="bold"
              color={"#0095DA"}
              display="inline"
              my="auto"
            >
              Shop
            </Text>
            <Text
              pl={"0"}
              fontSize={"30px"}
              fontWeight="bold"
              color={"#F7931E"}
              display="inline"
              my="auto"
            >
              edia
            </Text>
          </Link>
        </Box>
      </Box>
      <Box w={"984px"} p="0 20px" mx="auto">
        <Flex>
          <Box w="589px" mr="45px">
            <Box mt="40px">
              <Text fontWeight={"bold"} fontSize="24px" mb="20px">
                Checkout
              </Text>
              <Box borderBottom="6px solid var(--N100,#DBDEE2)">
                <ChangeAddress />
              </Box>
              {/* Product List lanjut disini */}
            </Box>
          </Box>
          <Box w="350px" mt="91px">
            <Box>
              <Box
                inset="92px auto auto 0px"
                zIndex={"1"}
                boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                borderRadius="8px"
              >
                <Box p="16px">
                  <Text fontWeight={"bold"}>Shopping summary</Text>
                  <Box m="16px 0">
                    <Box display={"flex"} justifyContent="space-between">
                      <Box>Total price (2 products)</Box>
                      <Box>Rp. 239.800</Box>
                    </Box>
                    <Box display={"flex"} justifyContent="space-between">
                      <Box>Total Shipping Cost</Box>
                      <Box>Rp. 29.800</Box>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent="space-between"
                    pt="16px"
                    mb="17px"
                    borderTop="1px solid var(--N100,#DBDEE2)"
                    fontSize={"17px"}
                    fontWeight={"bold"}
                  >
                    <Box>Total Bill</Box>
                    <Box>Rp. 29.800</Box>
                  </Box>
                  <Button
                    bgColor={"#0095DA"}
                    color="white"
                    fontWeight={"bold"}
                    w="100%"
                  >
                    Select Payment
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Alert
        body={"Changes you make to this page will not be saved"}
        cancelRef={cancelRef}
        color="#0095DA"
        isOpen={isOpen}
        header="Back To Cart?"
        leftButton={"Stay On This Page"}
        rightButton={"Go Back & Delete Changes"}
        onClose={onClose}
        onSubmit={() => navigate("/cart")}
      />
    </Box>
  )
}

export default Checkout
