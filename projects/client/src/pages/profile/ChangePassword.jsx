import { Box, Button, Text, HStack } from "@chakra-ui/react"
import { BiUser } from "react-icons/bi"
import { Link } from "react-router-dom"
import Password from "../../components/profile/Password"
import { useSelector } from "react-redux"

const ChangePassword = () => {
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
                                <Box
                                    p="16px 24px"
                                    _hover={{ color: "#0095DA" }}
                                >
                                    <Text>Personal Info</Text>
                                </Box>
                            </Link>
                        </Box>

                        {/* Change Password */}
                        <Box display={"flex"} height="53px" fontWeight={"bold"}>
                            <Button
                                p="16px 24px"
                                color="#0095DA"
                                borderBottom={"2px solid #0095DA"}
                                borderRadius="1px"
                                variant="link"
                            >
                                <Text>Change Password</Text>
                            </Button>
                        </Box>

                        {/* Address List */}
                        <Box display={"flex"} height="53px" fontWeight={"bold"}>
                            <Link to="/user/profile/address">
                                <Box
                                    p="16px 24px"
                                    _hover={{ color: "#0095DA" }}
                                >
                                    <Text>Address List</Text>
                                </Box>
                            </Link>
                        </Box>
                    </HStack>
                    <Password />
                </Box>
            </Box>
        </Box>
    )
}

export default ChangePassword
